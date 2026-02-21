import json
import time
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def scrape_category(p, url, expected_count=50, category='supply', subcategory='Seeds'):
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    print(f"Navigating to {url}")
    page.goto(url, wait_until="domcontentloaded")
    
    products = []
    prev_height = 0
    
    with open("debug.html", "w", encoding="utf-8") as f:
        f.write(page.content())
    
    # Scroll multiple times to trigger lazy loading and load ~50 products
    for _ in range(15):
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1.5)
        
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Adjust selector based on BigHaat's structure
        items = soup.find_all('a', href=lambda x: x and '/products/' in x)
        
        new_height = page.evaluate("document.body.scrollHeight")
        
        for item in items:
            # The structure often has <img> inside, or text nearby in parent
            img_elem = item.find('img')
            parent_text = item.parent.parent.get_text(" ", strip=True) if item.parent and item.parent.parent else item.get_text(" ", strip=True)
            
            # Extract Price via regex looking for ₹ symbol
            import re
            price_match = re.search(r'₹\s*([0-9,]+)', parent_text)
            
            if img_elem and img_elem.get('alt') and price_match:
                title = img_elem.get('alt')
                
                # BigHaat uses dummy lazyloading or similar images often, but we will grab standard src
                img_src = img_elem.get('src', '')
                if not img_src or 'data:image' in img_src or 'arrow' in img_src or 'discount' in img_src.lower():
                    img_src = img_elem.get('data-src', img_src)
                    
                if img_src.startswith('//'): img_src = 'https:' + img_src
                
                # Check for duplicates
                if any(p['name'] == title for p in products):
                    continue
                
                # Skip invalid inputs
                if len(title) < 5 or "Rating" in title:
                    continue
                    
                price_str = price_match.group(1).replace(',', '')
                price = float(price_str) if price_str.isdigit() else 500
                
                products.append({
                    "name": title,
                    "price": price,
                    "farmer": "BigHaat Source",
                    "image": img_src,
                    "category": category,
                    "subCategory": subcategory,
                    "stock": "In Stock"
                })
                
                if len(products) >= expected_count:
                    break
                    
        if len(products) >= expected_count or new_height == prev_height:
            break
        prev_height = new_height
        
    browser.close()
    return products[:expected_count]

if __name__ == "__main__":
    with sync_playwright() as p:
        seeds = scrape_category(p, "https://www.bighaat.com/collections/seeds", 25, 'supply', 'Seeds')
        fertilizers = scrape_category(p, "https://www.bighaat.com/collections/fertilizers", 25, 'supply', 'Fertilizers')
        protection = scrape_category(p, "https://www.bighaat.com/collections/crop-protection", 25, 'supply', 'Crop Protection')
        implements = scrape_category(p, "https://www.bighaat.com/collections/implements", 25, 'supply', 'Farm Implements')
        
        all_products = seeds + fertilizers + protection + implements
        
        with open("bighaat_products.json", "w", encoding="utf-8") as f:
            json.dump(all_products, f, indent=4)
        print(f"Scraped {len(all_products)} products successfully.")
