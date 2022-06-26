import { CheckIcon } from '@heroicons/react/solid';
import ConfirmationModal from 'components/confirmationModal/ConfirmationModal';
import Layout from 'components/Layout/Layout';
import TestList from 'components/TestList/testList';
import { toast } from 'react-hot-toast';
import _fetch from 'isomorphic-fetch';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { absoluteUrlPrefix } from 'next.config';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
	context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=61');
	const session = await getSession(context);
	let testsFetch = await _fetch(`${absoluteUrlPrefix}/api/v2/tests/${session.email}`, {
		method: 'GET',
	});
	let fetchedDataForIds = await testsFetch.json();

	let testsIds = [];
	for (let i of fetchedDataForIds?.data) {
		testsIds.push(i.test_id);
	}

	const testsDataFetch = await _fetch(`${absoluteUrlPrefix}/api/v2/tests?by=test_id&tests=${JSON.stringify(testsIds)}`, {
		method: 'GET',
	});
	let testData = await testsDataFetch.json();
	const testsDoneFetch = await _fetch(`${absoluteUrlPrefix}/api/v2/test/done/one/${JSON.stringify(testsIds)}/${session.email}`, { method: 'GET' });
	let testDoneData = await testsDoneFetch.json();

	const createdTests = testData?.data?.filter((test) => test.test_creator === session.id);
	for (let i in createdTests) {
		const stats = await _fetch(`${absoluteUrlPrefix}/api/v2/test/stats/${createdTests[i].test_id}`, { method: 'GET' })
			.then((res) => res.json())
			.then((data) => data?.Stats[0])
			.catch((err) => console.log(err.statusText));
		createdTests[i].participants = stats?.allcount || 0;
	}
	const availableTests = testData?.data.filter((test) => moment(test.test_date) > moment() && test.test_creator !== session.id);
	const archivedTests = testData?.data.filter((test) => moment(test.test_date) < moment() && test.test_creator !== session.id);

	return {
		props: {
			testData: testData || [],
			createdTests: createdTests || [],
			availableTests: availableTests || [],
			archivedTests: archivedTests || [],
			testDoneData: testDoneData || [],
			userId: session.id,
		},
	};
}

function Show({ testData, createdTests, availableTests, archivedTests, testDoneData, userId }) {
	const [modalAction, setModalAction] = useState('');
	const [confirmation, setConfirmation] = useState(false);
	const [testIdToDelete, setTestIdToDelete] = useState('');
	const [showToast, setShowToast] = useState(false);
	const router = useRouter();
	const handleDeleteTest = async (test_id) => {
		setModalAction('modal-open');
		setTestIdToDelete(test_id);
	};
	const deleteTest = (async) => {
		let fetchResponse = fetch(`/api/v2/test/${testIdToDelete}`, { method: 'DELETE' })
			.then((res) => res.json())
			.catch((err) => err.json());

		toast.promise(fetchResponse, {
			loading: 'Deletion in process...',
			success: 'Test deleted!',
			error: ' Test not deleted!',
		});

		fetchResponse.finally(() => {
			router.reload();
		});
	};

	useEffect(() => {
		if (confirmation === true) {
			deleteTest();
			console.log('delete', testIdToDelete);
			setConfirmation(false);
		}
	}, [confirmation, testIdToDelete]);

	return (
		<Layout>
			<div className='flex flex-wrap justify-center overflow-x-hidden'>
				{testData?.data.length === 0 ? (
					<p className='my-5 text-lg'>Tests not found</p>
				) : (
					<div className='flex flex-wrap justify-center px-6  py-6 sm:items-start sm:space-x-2'>
						{/* tests created */}
						{createdTests && createdTests.length !== 0 && (
							<TestList header={'Created Tests'} tests={createdTests} testDone={testDoneData?.data} creator={true} handleDelete={handleDeleteTest} />
						)}

						{/* Available Tests */}
						{availableTests && availableTests.length !== 0 && <TestList header={'Available Tests'} tests={availableTests} testDone={testDoneData?.data} />}

						{/* Archived Tests */}
						{archivedTests && archivedTests.length !== 0 && <TestList header={'Archived Tests'} tests={archivedTests} testDone={testDoneData?.data} />}
					</div>
				)}
			</div>
			<ConfirmationModal setConfirmation={setConfirmation} modalAction={modalAction} setModalAction={setModalAction} modalText={'Do You wish to delete this test?'} />
		</Layout>
	);
}

export default Show;
