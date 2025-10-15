/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",  // domain ảnh avatar của bạn
                // hoặc nếu bạn dùng nhiều subdomain: hostname: "**.cloudinary.com"
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.pinimg.com",  // domain ảnh avatar của bạn
                // hoặc nếu bạn dùng nhiều subdomain: hostname: "**.cloudinary.com"
                pathname: "/**",
            },
            // bạn có thể thêm patterns cho các domain khác nếu cần
        ],
        // domains: [] // bạn có thể bỏ phần domains nếu trước đó có
    },
};

module.exports = nextConfig;
