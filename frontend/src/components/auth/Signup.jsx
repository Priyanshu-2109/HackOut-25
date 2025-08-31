import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Signup = ({ onSuccess }) => {
	const { signup } = useAuth();
	const { showSuccess, showError } = useToast();
	const [form, setForm] = useState({ username: '', fullname: '', email: '', password: '' });
	const [loading, setLoading] = useState(false);

	const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		console.log('📝 Signup form submitted:', { ...form, password: '[HIDDEN]' });
		setLoading(true);
		try {
			const res = await signup(form);
			if (res.success) {
				showSuccess(res.message);
				console.log('✅ Signup successful');
				onSuccess?.();
			} else {
				showError(res.message || 'Registration failed');
				console.log('❌ Signup failed:', res.message);
			}
		} catch (err) {
			showError(err.message || 'Registration failed');
			console.error('❌ Signup error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
			<form onSubmit={onSubmit} className="space-y-3">
				<input name="fullname" value={form.fullname} onChange={onChange} placeholder="Full name" required className="w-full px-3 py-2.5 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
				<input name="username" value={form.username} onChange={onChange} placeholder="Username" required className="w-full px-3 py-2.5 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
				<input type="email" name="email" value={form.email} onChange={onChange} placeholder="Email" required className="w-full px-3 py-2.5 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
				<input type="password" name="password" value={form.password} onChange={onChange} placeholder="Password" required className="w-full px-3 py-2.5 border mb-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
				<p className="text-xs mb-4 text-gray-500">Password must be 8+ chars, include upper, lower, number and special.</p>
				<button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl shadow-sm transition">{loading ? 'Creating...' : 'Create account'}</button>
			</form>
	);
};

export default Signup;

