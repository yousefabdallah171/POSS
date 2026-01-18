package middleware

import (
	"fmt"
	"net/http"
)

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("=== CORS MIDDLEWARE ===")
		fmt.Printf("Incoming request: %s %s\n", r.Method, r.URL.Path)
		fmt.Printf("Origin: %s\n", r.Header.Get("Origin"))
		fmt.Printf("Content-Type: %s\n", r.Header.Get("Content-Type"))

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-ID, X-Restaurant-ID")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			fmt.Println("OPTIONS preflight request - responding with 200")
			w.WriteHeader(http.StatusOK)
			return
		}

		fmt.Println("Passing request to handler...")
		next.ServeHTTP(w, r)
		fmt.Println("=== END CORS MIDDLEWARE ===")
	})
}
