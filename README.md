# LoyaltyPointsSystem - Frontend

This is the frontend for the **LoyaltyPointsSystem** built on the **Aptos Blockchain**. The platform enables businesses to issue, redeem, and manage loyalty points for their customers. Customers can view their points balance, redeem points for rewards, and transfer points to other customers through secure blockchain transactions.

## Key Features

- **View Points Balance**: Users can check their loyalty points balance.
- **Issue Points**: Businesses can issue loyalty points to customers.
- **Redeem Points**: Customers can redeem loyalty points for rewards or services.
- **Transfer Points**: Users can transfer their loyalty points to others.
- **Transaction Handling**: All loyalty point transactions are securely managed through smart contracts on the Aptos blockchain.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** extension (e.g., Petra Wallet) for blockchain interactions

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/your-repo/loyalty-points-system.git
cd loyalty-points-system
```

### 2. Install Dependencies

Install the necessary dependencies for the project using **npm** or **yarn**:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Environment Variables

You need to configure the environment variables for the frontend to interact with the Aptos blockchain. Create a `.env` file in the project root and add the following variables:

```bash
PROJECT_NAME=LoyaltyPointsSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x<your_contract_address>
```

Adjust the `VITE_APP_NETWORK` and `VITE_MODULE_ADDRESS` as per your deployment setup.

### 4. Run the Development Server

Start the development server by running:

```bash
npm run dev
```

or

```bash
yarn run dev
```

The app will be available at `http://localhost:5173`.

## How to Use the Platform

### 1. Connect Wallet

Upon opening the application, you'll be prompted to connect your Aptos wallet (e.g., Petra Wallet). This allows you to interact with the blockchain and perform operations such as viewing loyalty points, issuing points, and redeeming points.

### 2. View Points Balance

Users can view their loyalty points balance by navigating to the **Points Balance** section, where their total points will be displayed along with transaction history.

### 3. Issue Points (Businesses)

Businesses can issue loyalty points to customers by navigating to the **Issue Points** section:

- Enter the customer’s address and the amount of loyalty points to issue.
- Submit the transaction to record it on the blockchain.

### 4. Redeem Points

Customers can redeem their loyalty points by:

- Selecting the **Redeem Points** option.
- Entering the amount of points to redeem.
- Confirming the redemption, which will trigger any predefined rewards or services.

### 5. Transfer Points

Users can transfer loyalty points to others by:

- Navigating to the **Transfer Points** section.
- Entering the recipient's address and the number of points to transfer.
- Confirming the transfer.

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm test`**: Runs unit tests.

## Dependencies

The project uses the following key dependencies:

- **React**: UI library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for type-safe development.
- **Aptos SDK**: JavaScript/TypeScript SDK to interact with the Aptos blockchain.
- **Ant Design / Tailwind CSS**: For responsive UI design and layout.
- **Petra Wallet Adapter**: To connect and interact with the Aptos wallet.

## Conclusion

This frontend allows businesses and customers to seamlessly interact with the **LoyaltyPointsSystem**, providing a decentralized, transparent, and secure way to manage loyalty points through the Aptos blockchain.