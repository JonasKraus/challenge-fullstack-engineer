import { useState, useEffect } from 'react';
import { BACKEND_ROUTES, BACKEND_BASE_URL } from "@challenge/utils";


function useGetData<T>(route: BACKEND_ROUTES, id: string) {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const routeWithId = route.replace(new RegExp(`:(email|trackingNumber)`, 'g'), id);
				const response = await fetch(`${BACKEND_BASE_URL}${routeWithId}`);
				if (!response.ok) {
					throw new Error(`HTTP GET request failed due to ${response.status}`);
				}
				const responseData = await response.json();
				setData(responseData);
				setLoading(false);
			} catch (err: unknown) {
				setError(err as Error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, loading, error };
}

export default useGetData;
