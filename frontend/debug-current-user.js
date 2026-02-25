// Debug script to check current user API call
// Run this in browser console to debug the issue

async function debugCurrentUser() {
    
    // Check if token exists
    const token = localStorage.getItem("accessToken");
    
    // Check API base URL
    const API_BASE_URL = "http://localhost:5000";
    const apiUrl = `${API_BASE_URL}/api/v1/users/me`;
    
    try {
        // Make direct API call
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        
        const data = await response.json();
        
        if (response.ok) {
        } else {
        }
    } catch (error) {
    }
    
    // Check React Query cache
    if (window.queryClient) {
        const cache = window.queryClient.getQueryCache();
        const currentUserQuery = cache.find(["current_user"]);
    } else {
    }
}

// Auto-run debug
debugCurrentUser();
