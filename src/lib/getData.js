import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useAuth } from './AppContext';
const url = 'https://book-appoitment-backend-server.vercel.app'



const fetchUsers = async () => {
    console.log('fetching users', process.env.BACKEND_PORT);
    const response = await fetch(`${url}/users/getAllUsers`);
    console.log('reponse', response);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};
export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
    });
}


export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId) => {
            const response = await fetch(`${url}/users/deleteUser/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, newRole }) => {
            const response = await fetch(`${url}/users/updateUserRole/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user role');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

const fethcBooks = async () => {
    console.log('fetching users', process.env.BACKEND_PORT);
    const response = await fetch(`${url}/books/GetallPenBook`);
    console.log('reponse', response);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export function useBooks() {
    return useQuery({
        queryKey: ['books'],
        queryFn: fethcBooks,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
    });
}

export function useDeleteBookRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId) => {
            const response = await fetch(`${url}/books/delete/${requestId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
}
//done
export function useApproveBookRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId) => {
            console.log("request", requestId)
            const pendingId = requestId.requestId
            const value = requestId.value
            console.log("Value", value)
            console.log("value", value)
            const response = await fetch(`${url}/books/approve/${pendingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: value }),
            });
            if (!response.ok) throw new Error('Failed to approve');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
}

//done
export function useAdminBooks() {
    return useQuery({
        queryKey: ["adminBooks"],
        queryFn: async () => {
            const response = await fetch(`${url}/books/allBooksFAdim`);
            if (!response.ok) throw new Error("Failed to fetch admin books");
            return response.json();
        },
    });
}


export function useUpdateBookStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookId, currentStatus, action }) => {
            const response = await fetch(`${url}/books/controlBookAction/${bookId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentStatus, action }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            return response.json();
        },
        onSuccess: () => {
            // ড্যাশবোর্ড গ্রিড রিফ্রেশ করার জন্য useAdminBooks এর queryKey এর সাথে মিল রাখুন
            queryClient.invalidateQueries({ queryKey: ["adminBooks"] });
        },
    });
}


export function useDeleteAdminBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookId, currentStatus }) => {
            const response = await fetch(`${url}/books/delete/${bookId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentStatus }),
            });
            if (!response.ok) throw new Error("Failed to delete book");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminBooks"] });
        },
    });
}
export function useGetAllApprovedBooks(filters = {}) {
    const { search, category, minFee, maxFee, sortBy, page, limit } = filters;

    return useQuery({
        queryKey: [
            "approvedBooks",
            search,
            category,
            minFee,
            maxFee,
            sortBy,
            page,
            limit,
        ],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (category && category !== "All") params.append("category", category);
            if (minFee) params.append("minFee", minFee);
            if (maxFee) params.append("maxFee", maxFee);
            if (sortBy) params.append("sortBy", sortBy);
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);

            const response = await fetch(
                `${url}/books/allApprovedBooks?${params.toString()}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch approved books");
            }

            return response.json(); // { books: [], pagination: {} }
        },
        placeholderData: keepPreviousData,
    });
}
export function useSingleBook(bookId) {
    console.log("getID", bookId)
    return useQuery({
        queryKey: ["bookDetails", bookId],
        queryFn: async () => {
            if (!bookId) return null;
            const response = await fetch(`https://book-appoitment-backend-server.vercel.app/books/details/${bookId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error("Failed to fetch book details");
            }

            return response.json();
        },
        enabled: !!bookId,
    });
}
export function useToggleWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, userEmail }) => {
            // URL-এর ভেতরের স্পেসিং বা নিউলাইন ঠিক করা হয়েছে
            const response = await fetch(`${url}/books/wishlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, userEmail }),
            });

            if (!response.ok) {
                throw new Error("Wishlist update failed");
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            // সফল হওয়ার পর নির্দিষ্ট বইয়ের ক্যাশ ডাটা রি-ফেচ করবে
            queryClient.invalidateQueries({ queryKey: ["bookDetails", variables.bookId] });
        },
    });
}

export function useGetUserWishlist(userEmail) {
    return useQuery({
        queryKey: ["userWishlist", userEmail],
        queryFn: async () => {
            if (!userEmail) return [];
            const response = await fetch(`${url}/books/wishlist/${userEmail}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to load wishlist");
            }

            return response.json();
        },
        enabled: !!userEmail,
    });
}
export function useLibrarianInventory(librarianEmail) {
    return useQuery({
        queryKey: ["librarianInventory", librarianEmail],
        enabled: !!librarianEmail,
        queryFn: async () => {
            const res = await fetch(
                `https://book-appoitment-backend-server.vercel.app/books/librarian/books/${librarianEmail}`
            );

            if (!res.ok) throw new Error("Failed to load inventory");

            return res.json();
        },
    });
}

// ২. স্ট্যাটাস টগল হুক
export function useTogglePublish() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookId, currentStatus }) => {
            const res = await fetch(`https://book-appoitment-backend-server.vercel.app/books/librarian/books/status/${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentStatus }),
            });
            if (!res.ok) throw new Error("Failed to change status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["librarianInventory"] });
        },
    });
}

// ৩. বুক ডিলিট হুক
export function useDeleteBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bookId) => {
            const res = await fetch(`https://book-appoitment-backend-server.vercel.app/books/librarian/books/${bookId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete book");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["librarianInventory"] });
        },
    });
}
export function useAllSalesReport() {
    return useQuery({
        queryKey: ["salesReport"],
        queryFn: async () => {
            const res = await fetch(`${url}/books/allSalesData`);
            if (!res.ok) throw new Error("Failed to fetch sales report");

            return res.json();
        },
    });
}

export function useLoginMutation() {
    const { login } = useAuth();
    const router = useRouter();
    return useMutation({
        mutationFn: async (credentials) => {
            console.log("creditantion", credentials)
            const response = await fetch(`${url}/users/loginUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            console.log("respnse", response)
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong during login");
            }
            console.log("data", data)
            return data;
        },

        onSuccess: (data) => {
            console.log("data", data)
            login(data.user);
            alert(`Welcome  ${data.user.name}!`);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Login Error:", error.message);
            alert(error.message || "Invalid credentials. Please try again.");
        },
    });
}


export function useGetEmailByBookId(bookId) {
    return useQuery({
        queryKey: ['useremailbyBookdId'],
        queryFn: async () => {
            const response = await fetch(`${url}/books/bookIdgetEmail/${bookId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to load wishlist");
            }

            return response.json();
        },

    });
}
export function useSalesReportLibarian(email) {
    return useQuery({
        queryKey: ['usersalesReport', email],
        queryFn: async () => {
            if (!email) return { success: true, salesReport: [] };
            const response = await fetch(`https://book-appoitment-backend-server.vercel.app/books/getSalesReport`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to load sales report");
            }

            return response.json();
        },
        enabled: !!email, // 👈 CRITICAL: This stops the query if email is ""
    });
}

export function useGetCommentSection(email) {
    return useQuery({
        queryKey: ['userComment', email],
        queryFn: async () => {
            if (!email) return { message: [] };
            const response = await fetch(`${url}/books/getComments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ useremail: email }),
            });

            if (!response.ok) {
                throw new Error("Failed to load your comments");
            }

            return response.json();
        },
        enabled: !!email,
    });
}

export function useGetReadingList(useremail) {
    console.log("issemail", useremail);

    return useQuery({
        queryKey: ['userReadingList', useremail],
        queryFn: async () => {
            if (!useremail) return { message: [] };
            const response = await fetch(`${url}/books/getReadingList`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: useremail
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to load your comments");
            }

            return response.json();
        },

        enabled: !!useremail,
    });
}

export function getBookData() {

}