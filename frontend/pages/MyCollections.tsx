import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, InputNumber, message, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

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

export function MyCollections() {
  const { account, signAndSubmitTransaction } = useWallet();

  const [jobsReferredBy, setJobsReferredBy] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const handleReferCandidate = async (values: {
    job_id: number;
    candidate_address: string;
    referral_message: string;
  }) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::JobReferralPlatform::refer_candidate`,
          functionArguments: [values.job_id, values.candidate_address, values.referral_message],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Refer  Successful!");
      fetchAllJobsONPlatform();
      fetchAllJobsReferredBy();
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
      console.log("Error Purchasing Policy.", error);
    }
  };

  const fetchAllJobsONPlatform = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::JobReferralPlatform::view_all_jobs`,
        functionArguments: [],
      };

      const result = await aptosClient().view({ payload });

      const jobList = result[0];

      if (Array.isArray(jobList)) {
        setJobs(
          jobList.map((job) => ({
            id: job.id,
            description: job.description,
            finders_fee: job.finders_fee, // Assuming finders_fee is part of the job or default to 0
            title: job.title, // Assuming title is part of the job or default to "Unknown"
            employer: job.employer, // Assuming employer is the employer
            referrals: job.referrals.map(
              (referral: { candidate: string; is_hired: boolean; referral_message: string; referrer: string }) => ({
                candidate: referral.candidate,
                is_hired: referral.is_hired, // Assuming is_hired is equivalent to is_claimed
                referral_message: referral.referral_message, // Assuming no referral message available
                referrer: referral.referrer, // Assuming referrer is the referrer
              }),
            ),
          })),
        );
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to get Policies by address:", error);
    }
  };
  const fetchAllJobsReferredBy = async () => {
    try {
      const WalletAddr = account?.address;
      if (!WalletAddr) {
        console.error("Wallet address is not available.");
        return;
      }

      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::JobReferralPlatform::view_referrals_by_referrer`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const jobList = result[0];

      if (Array.isArray(jobList)) {
        setJobsReferredBy(
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
        setJobsReferredBy([]);
      }
    } catch (error) {
      console.error("Failed to get referrals by referrer:", error);
    }
  };

  useEffect(() => {
    fetchAllJobsONPlatform();
    fetchAllJobsReferredBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <LaunchpadHeader title="All References" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={jobs} rowKey="id" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="id" />
                <Column title="Title" dataIndex="title" responsive={["md"]} />
                <Column
                  title="Finder's Fee"
                  dataIndex="finders_fee"
                  render={(finders_fee: number) => convertAmountFromOnChainToHumanReadable(finders_fee, 8)}
                  responsive={["md"]}
                />
                <Column title="Employer" dataIndex="employer" render={(employer: string) => employer.substring(0, 6)} />
                <Column
                  title="Description"
                  dataIndex="description"
                  responsive={["md"]}
                  render={(description: string) => description.substring(0, 300)}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Refer Candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleReferCandidate}
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
                <Form.Item
                  label="Referral Message"
                  name="referral_message"
                  rules={[{ required: true, message: "Please input the referral message!" }]}
                >
                  <Input.TextArea placeholder="Referral Message" rows={4} />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Refer Candidate
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Referrals by You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {jobsReferredBy.length > 0 ? (
                  jobsReferredBy.map((job, index) => (
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
                  ))
                ) : (
                  <Paragraph>No Jobs Referred by You.</Paragraph>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>All Jobs on the Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {jobs.map((job, index) => (
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
