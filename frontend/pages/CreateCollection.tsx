/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, InputNumber, message, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [jobsCreatedBy, setJobsCreatedBy] = useState<Job[]>([]);

  interface Job {
    id: string;
    description: string;
    finders_fee: number;
    title: string;
    employer: string;
    referrals: {
      candidate: string;
      is_hired: boolean;
      referral_message: string;
      referrer: string;
    }[];
  }

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleCreatePolicy = async (values: { finders_fee: number; title: string; description?: string }) => {
    try {
      const finderFee = convertAmountFromHumanReadableToOnChain(values.finders_fee, 8);

      if (!values.description) {
        values.description = "None";
      }

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::JobReferralPlatform::create_job`,
          functionArguments: [values.title, values.description, finderFee],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Job is Created Successfully!");
      fetchAllJobsCreatedBy();
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

  const handleVerifyClaim = async (values: { job_id: number; candidate_address: string }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::JobReferralPlatform::confirm_hire`,
          functionArguments: [values.job_id, values.candidate_address],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Candidate is Hired!");
      fetchAllJobsCreatedBy();
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

  const fetchAllJobsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::JobReferralPlatform::view_jobs_by_employer`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const jobList = result[0];

      if (Array.isArray(jobList)) {
        setJobsCreatedBy(
          jobList.map((job) => ({
            id: job.id,
            description: job.description,
            finders_fee: job.finders_fee,
            title: job.title,
            employer: job.employer,
            referrals: job.referrals.map(
              (referral: { candidate: string; is_hired: boolean; referral_message: string; referrer: string }) => ({
                candidate: referral.candidate,
                is_hired: referral.is_hired,
                referral_message: referral.referral_message,
                referrer: referral.referrer,
              }),
            ),
          })),
        );
      } else {
        setJobsCreatedBy([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };

  useEffect(() => {
    fetchAllJobsCreatedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, fetchAllJobsCreatedBy]);

  return (
    <>
      <LaunchpadHeader title="Create Job" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Job</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreatePolicy}
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
                <Form.Item
                  label="Job Title"
                  name="title"
                  rules={[{ required: true, message: "Please input the job title!" }]}
                >
                  <Input placeholder="Job Title" />
                </Form.Item>
                <Form.Item
                  label="Job Description"
                  name="description"
                  rules={[{ required: true, message: "Please input the job description!" }]}
                >
                  <Input.TextArea placeholder="Job Description" rows={4} />
                </Form.Item>
                <Form.Item
                  label="Finder's Fee (APT)"
                  name="finders_fee"
                  rules={[{ required: true, message: "Please input the finder's fee!" }]}
                >
                  <InputNumber min={1} placeholder="Finder's Fee" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Job
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Hire Candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleVerifyClaim}
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
                <Form.Item
                  label="Job ID"
                  name="job_id"
                  rules={[{ required: true, message: "Please input the job ID!" }]}
                >
                  <InputNumber min={1} placeholder="Job ID" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Candidate Address"
                  name="candidate_address"
                  rules={[{ required: true, message: "Please input the candidate's address!" }]}
                >
                  <Input placeholder="Candidate Address" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Hire
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
                {jobsCreatedBy.map((job, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <p className="text-sm text-gray-500 mb-4">Job ID: {job.id}</p>
                    <Paragraph>
                      <strong>Title:</strong> {job.title}
                    </Paragraph>
                    <Paragraph>
                      <strong>Employer:</strong> <Tag>{job.employer}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Finder's Fee:</strong>{" "}
                      <Tag>{convertAmountFromOnChainToHumanReadable(job.finders_fee, 8)}</Tag>
                    </Paragraph>
                    <Paragraph>
                      <strong>Description:</strong> {job.description}
                    </Paragraph>
                    <Paragraph>
                      <strong>Referrals:</strong>
                      {job.referrals.length > 0 ? (
                        <Card style={{ marginTop: 16, padding: 16 }}>
                          {job.referrals.map((referral, idx) => (
                            <div key={idx} className="mb-4">
                              <Paragraph>
                                <strong>Candidate:</strong> <Tag>{referral.candidate}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Hired:</strong> <Tag>{referral.is_hired ? "Yes" : "No"}</Tag>
                              </Paragraph>
                              <Paragraph>
                                <strong>Referral Message:</strong> {referral.referral_message}
                              </Paragraph>
                              <Paragraph>
                                <strong>Referrer:</strong> <Tag>{referral.referrer}</Tag>
                              </Paragraph>
                            </div>
                          ))}
                        </Card>
                      ) : (
                        <Paragraph>No Referrals Found for this Job.</Paragraph>
                      )}
                    </Paragraph>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
