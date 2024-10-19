# 🚀 Loyalty Points System - Frontend

Welcome to the **Loyalty Points System** frontend, a decentralized application built on the **Aptos Blockchain**. This platform empowers businesses to issue loyalty points to customers, allowing customers to redeem points, transfer them to others, and manage their balances with secure blockchain transactions.

---

## 🔗 Links

- **Live Demo**: [Loyalty Points System](https://aptos-loyalty-point.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x44e4bfdbe756654c954112a24d3eab079f9acf2f6ec8c64b2a8bfd7c99ec70ed/modules/code/LoyaltyPointsSystem?network=testnet)

---

## ✨ Key Features

- **View Points Balance**: Users can check their loyalty points balance and transaction history.
- **Issue Points**: Businesses can issue loyalty points to customers securely on the blockchain.
- **Redeem Points**: Customers can redeem loyalty points for predefined rewards or services.
- **Transfer Points**: Users can transfer points to others using their Aptos wallets.
- **Blockchain Transactions**: All operations are managed securely through smart contracts deployed on the Aptos blockchain.

---

## 📋 Prerequisites

Ensure the following tools are installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., **Petra Wallet**) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

First, clone the project repository and move into the project directory:

```bash
cd loyalty-points-system
```

### 2. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```bash
PROJECT_NAME=LoyaltyPointsSystem
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x44e4bfdbe756654c954112a24d3eab079f9acf2f6ec8c64b2a8bfd7c99ec70ed
```

Update the **VITE_MODULE_ADDRESS** with the deployed smart contract address.

### 4. Run the Development Server

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    sys_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "44e4bfdbe756654c954112a24d3eab079f9acf2f6ec8c64b2a8bfd7c99ec70ed"
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

Connect your **Aptos Wallet** (e.g., **Petra Wallet**) to interact with the blockchain. This enables you to issue, transfer, and redeem points seamlessly.

### 2. View Points Balance

Navigate to the **Points Balance** section to view your total points and transaction history.

### 3. Issue Points (For Businesses)

Businesses can issue points to customers:

1. Go to the **Issue Points** section.
2. Enter the customer’s address and the amount of points.
3. Submit the transaction to record it on the blockchain.

### 4. Redeem Points

To redeem loyalty points:

1. Navigate to the **Redeem Points** section.
2. Enter the amount to redeem and confirm.
3. The redemption will trigger any predefined rewards or services.

### 5. Transfer Points

Users can transfer points to other customers:

1. Go to the **Transfer Points** section.
2. Enter the recipient’s address and the number of points.
3. Confirm the transfer through your wallet.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the project for production.
- **`npm test`**: Run unit tests.

---

## 🔍 Dependencies

- **React**: Library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type-safe coding.
- **Aptos SDK**: JS/TS SDK for blockchain interaction.
- **Ant Design / Tailwind CSS**: For responsive UI and layout.
- **Petra Wallet Adapter**: Connect and interact with Aptos wallets.

---

## 📚 Available View Functions

- **View Points Balance**: Displays the current balance and transaction history.
- **View Points Issued by Business**: Shows all points issued by a specific business.
- **View Transfers by User**: Lists points transferred by or to a specific user.

---

## 🛡 Security and Transparency

- **Smart Contracts**: All point-related operations are executed securely on-chain.
- **No Intermediaries**: Transactions are peer-to-peer and transparent.
- **Real-Time Tracking**: Users can view their balances and transactions in real-time.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Issues**: Ensure the wallet extension is installed and connected.
2. **RPC Rate Limits**: Use **private RPC providers** to avoid public network limits.
3. **Transaction Errors**: Ensure sufficient balance and permissions for transactions.

---

## 🚀 Scaling and Deployment

If deploying on **Vercel** or similar platforms, consider:

- Using **third-party RPC providers** like **Alchemy** or **QuickNode**.
- Implementing **request throttling** to avoid overload.
- Utilizing **WebSockets** for real-time updates.

---

## 🎉 Conclusion

The **Loyalty Points System** offers businesses a decentralized way to manage loyalty programs. With secure smart contracts and transparent operations, customers can redeem and transfer points seamlessly. The platform ensures smooth, on-chain interactions between businesses and customers, making loyalty management efficient and rewarding.
