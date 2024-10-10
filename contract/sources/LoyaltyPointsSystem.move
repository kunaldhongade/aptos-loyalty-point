module my_addrx::LoyaltyPointsSystem {
    use std::coin::{transfer};
    use std::aptos_coin::AptosCoin;
    use std::signer;
    use std::vector;
    use std::string::String;

    const ERR_CUSTOMER_NOT_FOUND: u64 = 1;
    const ERR_INSUFFICIENT_POINTS: u64 = 2;
    const ERR_UNAUTHORIZED: u64 = 3;
    const ERR_ALREADY_INITIALIZED: u64 = 4;
    const ERR_NO_POINTS_ISSUED: u64 = 5;

    const Global_Points_List: address = @sys_addrx;

    // Struct representing loyalty points issued to a customer
    struct LoyaltyPoints has key, store, copy, drop {
        customer: address,      // Customer's address
        points_balance: u64,    // Current balance of loyalty points
        issuer: address,        // Issuer's address (business)
    }

    // Struct representing the global collection of issued loyalty points
    struct GlobalPointsCollection has key, store, copy, drop {
        points: vector<LoyaltyPoints>,  // List of all customers with loyalty points
    }

    // Initialize the global loyalty points system (only called once)
    public entry fun init_loyalty_system(account: &signer) {
        let global_address = Global_Points_List;

        if (exists<GlobalPointsCollection>(global_address)) {
            abort(ERR_ALREADY_INITIALIZED)
        };

        let points_collection = GlobalPointsCollection {
            points: vector::empty<LoyaltyPoints>(),
        };

        move_to(account, points_collection);
    }

    // Issue loyalty points to a customer
    public entry fun issue_points(
        account: &signer,
        customer: address,
        amount: u64
    ) acquires GlobalPointsCollection {
        let issuer_address = signer::address_of(account);
        let global_address = Global_Points_List;

        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global_mut<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;
        let is_existing_customer = false;

        // Check if the customer already has a loyalty points balance
        while (i < points_len) {
            let points_ref = vector::borrow_mut(&mut collection_ref.points, i);
            if (points_ref.customer == customer) {
                points_ref.points_balance = points_ref.points_balance + amount;  // Add the new points to the balance
                is_existing_customer = true;
                return
            };
            i = i + 1;
        };

        // If the customer is new, create a new loyalty points record
        if (!is_existing_customer) {
            let new_points = LoyaltyPoints {
                customer: customer,
                points_balance: amount,
                issuer: issuer_address,
            };
            vector::push_back(&mut collection_ref.points, new_points);
        };
    }

    // Redeem loyalty points (e.g., for rewards or services)
    public entry fun redeem_points(
        account: &signer,
        customer: address,
        amount: u64
    ) acquires GlobalPointsCollection {
        let redeemer_address = signer::address_of(account);
        let global_address = Global_Points_List;

        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global_mut<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;

        while (i < points_len) {
            let points_ref = vector::borrow_mut(&mut collection_ref.points, i);
            if (points_ref.customer == customer) {
                // Ensure the customer has enough points to redeem
                assert!(points_ref.points_balance >= amount, ERR_INSUFFICIENT_POINTS);

                // Deduct the redeemed points
                points_ref.points_balance = points_ref.points_balance - amount;

                // Example of redeeming by transferring rewards (APT tokens)
                transfer<AptosCoin>(account, customer, amount);
                return
            };
            i = i + 1;
        };
        abort(ERR_CUSTOMER_NOT_FOUND)
    }

    // Transfer loyalty points between customers
    public entry fun transfer_points(
        account: &signer,
        recipient: address,
        amount: u64
    ) acquires GlobalPointsCollection {
        let sender_address = signer::address_of(account);
        let global_address = Global_Points_List;

        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global_mut<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let sender_index = 0;
        let recipient_index = 0;
        let is_sender_found = false;
        let is_recipient_found = false;

        // Find sender and recipient in the points list
        while (sender_index < points_len) {
            let sender_ref = vector::borrow_mut(&mut collection_ref.points, sender_index);
            if (sender_ref.customer == sender_address) {
                assert!(sender_ref.points_balance >= amount, ERR_INSUFFICIENT_POINTS);
                sender_ref.points_balance = sender_ref.points_balance - amount;
                is_sender_found = true;
                break
            };
            sender_index = sender_index + 1;
        };
        assert!(is_sender_found, ERR_CUSTOMER_NOT_FOUND);

        // Add points to the recipient's balance
        while (recipient_index < points_len) {
            let recipient_ref = vector::borrow_mut(&mut collection_ref.points, recipient_index);
            if (recipient_ref.customer == recipient) {
                recipient_ref.points_balance = recipient_ref.points_balance + amount;
                is_recipient_found = true;
                return
            };
            recipient_index = recipient_index + 1;
        };

        // If recipient is new, create a new record
        if (!is_recipient_found) {
            let new_points = LoyaltyPoints {
                customer: recipient,
                points_balance: amount,
                issuer: sender_address, // Track the sender as the issuer here
            };
            vector::push_back(&mut collection_ref.points, new_points);
        };
    }

    // View loyalty points balance of a specific customer
    #[view]
    public fun view_points_by_customer(customer: address): u64 acquires GlobalPointsCollection {
        let global_address = Global_Points_List;
        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;

        while (i < points_len) {
            let points_ref = vector::borrow(&collection_ref.points, i);
            if (points_ref.customer == customer) {
                return points_ref.points_balance
            };
            i = i + 1;
        };
        abort(ERR_CUSTOMER_NOT_FOUND)
    }

    // View all customers with loyalty points
    #[view]
    public fun view_all_customers_with_points(): vector<address> acquires GlobalPointsCollection {
        let global_address = Global_Points_List;
        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;
        let result = vector::empty<address>();

        while (i < points_len) {
            let points_ref = vector::borrow(&collection_ref.points, i);
            vector::push_back(&mut result, points_ref.customer);
            i = i + 1;
        };
        result
    }

    // View loyalty points issued by a specific business
    #[view]
    public fun view_points_issued_by_business(business: address): vector<LoyaltyPoints> acquires GlobalPointsCollection {
        let global_address = Global_Points_List;
        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;
        let result = vector::empty<LoyaltyPoints>();

        while (i < points_len) {
            let points_ref = vector::borrow(&collection_ref.points, i);
            if (points_ref.issuer == business) {
                vector::push_back(&mut result, *points_ref);
            };
            i = i + 1;
        };
        result
    }

    // View all issued loyalty points (for debugging or admin purposes)
    #[view]
    public fun view_all_issued_points(): vector<LoyaltyPoints> acquires GlobalPointsCollection {
        let global_address = Global_Points_List;
        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global<GlobalPointsCollection>(global_address);
        collection_ref.points
    }

    #[view]
    public fun view_total_points_issued_by_business(business: address): u64 acquires GlobalPointsCollection {
        let global_address = Global_Points_List;
        assert!(exists<GlobalPointsCollection>(global_address), ERR_NO_POINTS_ISSUED);

        let collection_ref = borrow_global<GlobalPointsCollection>(global_address);
        let points_len = vector::length(&collection_ref.points);
        let i = 0;
        let total = 0;

        while (i < points_len) {
            let points_ref = vector::borrow(&collection_ref.points, i);
            if (points_ref.issuer == business) {
                total = total + points_ref.points_balance;
            };
            i = i + 1;
        };
        total
    }
}
