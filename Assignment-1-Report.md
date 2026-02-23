# Assignment 1

## Project Details

*   **Title of the Problem:** Website for Direct Market Access for Farmers
*   **Category:** Software
*   **Theme:** Agriculture, FoodTech & Rural Development
*   **Problem Description:** Developing solutions, keeping in mind the need to enhance the primary sector of India - Agriculture and to manage and process our agriculture produce.

---

## 1. Requirements Gathered

Based on the problem statement and the ongoing development, the following key requirements have been identified for the website:

### User Roles
*   **Farmers:** Need an interface to easily list and manage their agricultural produce, view inventory, and receive orders directly from consumers without middlemen.
*   **Consumers:** Need a marketplace to browse fresh farm produce, add items to a cart, securely checkout, and track their orders.

### Core Features
1.  **Authentication & Security:**
    *   Secure login using phone numbers and OTP verification (via Firebase Authentication).
    *   Separate login flows for Farmers (`ConsumerLogin`) and Consumers (`FarmerLogin`).
2.  **Farmer Dashboard:**
    *   An inventory management system where farmers can add new products, categorize them, and set prices.
    *   Visibility into active listings and past sales.
3.  **Consumer Marketplace:**
    *   A dynamic marketplace displaying only the current inventory actively listed by the farmers.
    *   Categorized views (e.g., vegetables, fruits, grains) for easier browsing.
4.  **Shopping experience:**
    *   Add to Cart functionality.
    *   Seamless Checkout process.
    *   "My Orders" section for consumers to track their past and current purchases.
5.  **Interactive Elements:**
    *   Live Mandi Price Ticker to keep users informed about real-time market rates.
    *   Responsive UI for accessibility across both desktop and mobile devices.

---

## 2. Workflow Diagram

The flowchart below illustrates the standard user journey and data flow within the platform for both Farmers and Consumers.

```text
================================================================================
                              [ Landing Page / Home ]
================================================================================
                                        |
                             [ Select User Role ]
                                /              \
           ---------------------                ---------------------
           |      FARMER       |                |     CONSUMER      |
           ---------------------                ---------------------
                     |                                    |
      [ Farmer Verification via OTP ]      [ Consumer Verification via OTP ]
                     |                                    |
           [ Farmer Dashboard ]            [ Marketplace / Category Pages ]
                     |                                    |
          [ Add & Manage Inventory ]           [ View Farmers' Produce ]
                     |                                    |
          ( Central Database / Store )  <--   [ Displays Available Products ]
                                                          |
                                                 [ Add Items to Cart ]
                                                          |
                                                  [ Secure Checkout ]
                                                          |
                                                [ Order Confirmation ]
                                                          |
                                                 [ View My Orders ]
```

## 3. Web References / Research

The following external resources and concepts were referenced to understand the domain of direct agricultural marketing in India and to design the feature set for this platform:

1.  **National Agriculture Market (e-NAM):** A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities. Our platform's "Mandi Ticker" is inspired by the need for transparent price discovery promoted by e-NAM.
    *   *Reference:* [e-NAM Official Website](https://www.enam.gov.in/)
2.  **Farmer Producer Organizations (FPOs):** Government initiatives promoting FPOs aim to give farmers collective bargaining power and direct market access. This software acts as a technical enabler for individual farmers or FPOs to sell directly to consumers.
    *   *Reference:* Ministry of Agriculture & Farmers Welfare, [Formation and Promotion of 10,000 FPOs](https://agricoop.nic.in/)
3.  **Direct-to-Consumer (D2C) AgTech Models:** Research highlighting that eliminating intermediaries (middlemen) leads to higher profit margins for farmers and fresher produce for consumers, which is the core problem statement of this project.
    *   *Reference:* "Direct Market Access for Farmers: Challenges and Opportunities", [Observer Research Foundation (ORF) India](https://www.orfonline.org/)
4.  **Firebase Authentication Standards:** Best practices for securing web applications using phone number and OTP verification tailored for rural internet users who may not use traditional email/password logins.
    *   *Reference:* [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

---

*End of Report*
