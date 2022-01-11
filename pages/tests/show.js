import Layout from "components/Layout/Layout";
import MyTests from "components/Layout/LoggedContent/MyTests/MyTests";
import _fetch from "isomorphic-fetch";
import { useSession } from "next-auth/react";
import { absoluteUrlPrefix } from "next.config";
import { useEffect, useState } from "react";

function show() {
  const [testData, setTestData] = useState([]);
  const [testsIds, setTestsIds] = useState([]);
  const [testsFound, setTestsFound] = useState(0);
  const { data: user, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      const response = _fetch(
        `${absoluteUrlPrefix}/api/test/getUserTests?user_id=${user.id}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setTestsFound(data.length);
          data.forEach((value, index, array) => {
            setTestsIds((prev) => [...prev, value.test_id]);
          });
        });
    }
  }, [status]);

  useEffect(() => {
    if (testsIds.length !== testsFound || testsIds.length === 0) return;
    const response = _fetch(
      `${absoluteUrlPrefix}/api/test/getTests?tests=${JSON.stringify(
        testsIds
      )}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => setTestData(data));
  }, [testsIds]);

  return (
    <Layout>
      <MyTests tests={testData} />
    </Layout>
  );
}

export default show;
