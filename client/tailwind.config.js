export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "gray-dark": "#444444",
                "gray-mild": "#666666",
                "gray-normal": "#888888",
                "gray-subtle": "#aaaaaa",
                "gray-light": "#dddddd",
                "gray-lighter": "#eeeeee",
                "blue-basic": "#4a86e8",
                "red-caution": "#dc0000"
            },
            keyframes: {
                rotateSteps: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" }
                }
            },
            animation: {
                rotate8: "rotateSteps 0.8s steps(8) infinite"
            }
        }
    },
    plugins: []
}