import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, Table, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";

const { Column } = Table;
const { Paragraph } = Typography;

interface LoyaltyPoints {
  customer: string;
  issuer: string;
  points_balance: number;
}

export function MyCollections() {
  const { account } = useWallet();
  const [allCustomers, setAllCustomers] = useState<LoyaltyPoints[]>([]);
  const [pointsIssuedByBusiness, setPointsIssuedByBusiness] = useState<LoyaltyPoints[]>([]);
  const [customerPoints, setCustomerPoints] = useState<number | null>(null);

  // Fetch all loyalty points issued by the business
  const fetchPointsIssuedByBusiness = async () => {
    try {
      const WalletAddr = account?.address;
      if (!WalletAddr) {
        console.error("Wallet address is not available.");
        return;
      }

      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::view_points_issued_by_business`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });
      const pointsList = result[0];

      if (Array.isArray(pointsList)) {
        setPointsIssuedByBusiness(
          (pointsList as LoyaltyPoints[]).map((points) => ({
            customer: (points as LoyaltyPoints).customer,
            issuer: (points as LoyaltyPoints).issuer,
            points_balance: (points as LoyaltyPoints).points_balance,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to get points issued by business:", error);
    }
  };

  // Fetch loyalty points for all customers
  const fetchAllCustomersWithPoints = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::view_all_customers_with_points`,
        functionArguments: [],
      };

      const result = await aptosClient().view({ payload });
      const customersList = result[0];
      setAllCustomers(customersList as LoyaltyPoints[]);
      console.log(allCustomers);
    } catch (error) {
      console.error("Failed to get all customers with points:", error);
    }
  };

  // Fetch points by a specific customer address
  const fetchPointsByCustomer = async (customerAddress: string) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::view_points_by_customer`,
        functionArguments: [customerAddress],
      };

      const result = await aptosClient().view({ payload });
      const points = result[0] as number | null;

      setCustomerPoints(points);
    } catch (error) {
      console.error("Failed to get points by customer:", error);
    }
  };

  useEffect(() => {
    fetchAllCustomersWithPoints();
    fetchPointsIssuedByBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <LaunchpadHeader title="Loyalty Points Overview" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          {/* View Points Issued by Business */}
          <Card>
            <CardHeader>
              <CardDescription>Points Issued by Business</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={pointsIssuedByBusiness} rowKey="customer" className="max-w-screen-xl mx-auto">
                <Column title="Customer" dataIndex="customer" />
                <Column title="Points Balance" dataIndex="points_balance" />
              </Table>
            </CardContent>
          </Card>

          {/* View Points by Customer */}
          <Card>
            <CardHeader>
              <CardDescription>View Points by Customer Address</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={(values) => fetchPointsByCustomer(values.customer_address)}
                layout="inline"
                style={{ maxWidth: 600 }}
              >
                <Form.Item label="Customer Address" name="customer_address" rules={[{ required: true }]}>
                  <Input placeholder="Customer Address" />
                </Form.Item>
                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base" type="submit">
                    View Points
                  </Button>
                </Form.Item>
              </Form>
              {customerPoints !== null && (
                <div className="mt-4">
                  <Paragraph>
                    <strong>Points Balance:</strong> {customerPoints}
                  </Paragraph>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
