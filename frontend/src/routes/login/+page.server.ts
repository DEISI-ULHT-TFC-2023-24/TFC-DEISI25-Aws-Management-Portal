import { getUserDataFromJwt, type User } from "$lib/domain/user";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		await fetch(
			// TODO: make this not hardcoded
			"http://localhost:3000/auth/authenticate",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ username: username, password: password }),
			},
		).then(async (res) => {
			const data = await res.json();

			if (res.status != 200) {
				// TODO: add notification on failed request
				console.log(JSON.stringify(data));
			} else {
				// set token cookie
				cookies.set('token', data.token);

				const userData: User | null = getUserDataFromJwt(data.token);

				// successful login redirect based on user
				if (userData && userData.role == 'root') {
					throw redirect(303, '/root');
				} else if (userData && userData.role == 'admin') {
					// TODO: update this when admin acc is fully implemented
					throw redirect(303, '/');
				} else {
					// TODO: update this when user acc is fully implemented
					throw redirect(303, '/');
				}
			}
		});
	}
} satisfies Actions;