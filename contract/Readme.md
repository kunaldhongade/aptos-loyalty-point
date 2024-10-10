# LoyaltyPointsSystem - Smart Contract

This smart contract implements a **Loyalty Points System** on the **Aptos Blockchain**. It enables businesses to issue, redeem, transfer, and manage loyalty points for their customers. Customers can use the issued points for various rewards, and businesses can manage customer balances efficiently.

## Key Features

- **Loyalty Points Issuance**: Businesses can issue loyalty points to customers.
- **Loyalty Points Redemption**: Customers can redeem points for rewards or services, including transferring Aptos tokens as rewards.
- **Points Transfer**: Customers can transfer loyalty points to other customers.
- **Points Balance Inquiry**: View loyalty point balances for specific customers.
- **Global Points Management**: Manage and view all loyalty points across the system, including by individual business issuers.

## Error Codes

- **ERR_CUSTOMER_NOT_FOUND (1)**: The customer is not found in the loyalty points list.
- **ERR_INSUFFICIENT_POINTS (2)**: The customer does not have enough points to complete the action.
- **ERR_UNAUTHORIZED (3)**: Unauthorized operation.
- **ERR_ALREADY_INITIALIZED (4)**: Attempted to reinitialize the global loyalty points system.
- **ERR_NO_POINTS_ISSUED (5)**: The loyalty points system has not been initialized.

## Structs

- **LoyaltyPoints**: Represents the loyalty points issued to a customer, including the customer's address, points balance, and the issuing business's address.
- **GlobalPointsCollection**: Represents the global collection of all issued loyalty points.

## Functions

### 1. `init_loyalty_system(account: &signer)`
Initializes the global loyalty points system, ensuring it is only initialized once. This creates a global storage space for the collection of loyalty points.

### 2. `issue_points(account: &signer, customer: address, amount: u64)`
Issues loyalty points to a customer. If the customer already has a loyalty points balance, the issued points are added to the existing balance. If the customer is new, a new loyalty points record is created.

### 3. `redeem_points(account: &signer, customer: address, amount: u64)`
Allows customers to redeem loyalty points for rewards or services. The redeemed points are deducted from the customer's balance. In this example, a reward in the form of Aptos tokens is transferred to the customer.

### 4. `transfer_points(account: &signer, recipient: address, amount: u64)`
Transfers loyalty points from one customer to another. If the recipient is not in the system, a new record is created for them.

### 5. `view_points_by_customer(customer: address): u64`
Views the loyalty points balance of a specific customer.

### 6. `view_all_customers_with_points(): vector<address>`
Returns a list of all customers who have loyalty points.

### 7. `view_points_issued_by_business(business: address): vector<LoyaltyPoints>`
Returns all loyalty points issued by a specific business.

### 8. `view_all_issued_points(): vector<LoyaltyPoints>`
Returns all loyalty points issued in the system for debugging or administrative purposes.

## How to Use

### Deployment
1. **Initialization**: First, initialize the system by calling `init_loyalty_system`. This sets up global storage for loyalty points.
2. **Issuing Points**: Businesses can issue loyalty points by calling `issue_points`, specifying the customer’s address and the amount of points to issue.
3. **Redeeming Points**: Customers can redeem points by calling `redeem_points`. The points are deducted from their balance, and rewards are distributed accordingly.
4. **Transferring Points**: Customers can transfer their points to other users by calling `transfer_points`.
5. **Viewing Points**: Use `view_points_by_customer` to check a specific customer's point balance or `view_all_customers_with_points` to get a list of all customers with points.

## Prerequisites

- **Aptos SDK**: You need the Aptos SDK to interact with the blockchain.
- **Petra Wallet**: For signing and sending transactions on Aptos.

## Conclusion

The **Loyalty Points System** offers businesses a decentralized, blockchain-based way to manage customer loyalty programs. Customers can earn, redeem, and transfer points with secure, verifiable transactions. The global management of points makes the system scalable and transparent for businesses and users alike.