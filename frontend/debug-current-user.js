// Debug script to check current user API call
// Run this in browser console to debug the issue

async function debugCurrentUser() {
    console.log("=== Debugging Current User ===");
    
    // Check if token exists
    const token = localStorage.getItem("accessToken");
    console.log("Token in localStorage:", token ? "EXISTS" : "MISSING");
    console.log("Token value:", token);
    
    // Check API base URL
    const API_BASE_URL = "http://localhost:5000";
    const apiUrl = `${API_BASE_URL}/api/v1/users/me`;
    console.log("API URL:", apiUrl);
    
    try {
        // Make direct API call
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log("Response data:", data);
        
        if (response.ok) {
            console.log("✅ API call successful");
        } else {
            console.log("❌ API call failed:", data);
        }
    } catch (error) {
        console.log("❌ Network error:", error);
    }
    
    // Check React Query cache
    console.log("=== React Query Cache ===");
    if (window.queryClient) {
        const cache = window.queryClient.getQueryCache();
        const currentUserQuery = cache.find(["current_user"]);
        console.log("Current user query in cache:", currentUserQuery);
    } else {
        console.log("Query client not accessible from window");
    }
}

// Auto-run debug
debugCurrentUser();
