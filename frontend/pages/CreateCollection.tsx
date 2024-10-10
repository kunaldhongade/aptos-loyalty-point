/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, message, Tag } from "antd";
import { useEffect, useState } from "react";

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [pointsList, setPointsList] = useState<LoyaltyPoints[]>([]);

  interface LoyaltyPoints {
    customer: string;
    issuer: string;
    points_balance: number;
  }

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleIssueTokens = async (values: LoyaltyPoints) => {
    try {
      const pointsAMT = convertAmountFromHumanReadableToOnChain(values.points_balance, 8);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::issue_points`,
          functionArguments: [values.customer, pointsAMT],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Token Issued Successfully!");
      fetchAllPointsCreatedBy();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating Job.", error);
    }
  };

  const handleRedeemPoints = async (values: LoyaltyPoints) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::redeem_points`,
          functionArguments: [values.customer, values.points_balance],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Candidate is Hired!");
      fetchAllPointsCreatedBy();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Hiring Candidate.", error);
    }
  };

  const fetchAllPointsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::LoyaltyPointsSystem::view_points_issued_by_business`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const pointsList = result[0] as LoyaltyPoints[];

      if (Array.isArray(pointsList)) {
        setPointsList(pointsList);
      } else {
        setPointsList([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllPointsCreatedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fetchAllPointsCreatedBy]);

  return (
    <>
      <LaunchpadHeader title="Create Job" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Issue Points</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleIssueTokens}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Customer Address" name="customer" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Amount" name="points_balance" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Issue Points
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Redeem Points</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleRedeemPoints}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Customer Address" name="customer" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Amount" name="points_balance" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Issue Points
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Get Jobs Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {pointsList.map((point, index) => (
                  <div key={index}>
                    <Card style={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <div className="m-3">
                          <Tag color="blue">Customer</Tag>: <Tag>{point.customer}</Tag>
                          <br />
                          <Tag color="green">Issuer</Tag>: <Tag>{point.issuer}</Tag>
                          <br />
                          <Tag color="gold">Points Balance</Tag>:{" "}
                          <Tag>{convertAmountFromOnChainToHumanReadable(point.points_balance, 8)}</Tag>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
