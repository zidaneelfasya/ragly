import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Geometric Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-secondary/80 relative overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Top Left Triangle */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/40 to-transparent transform -translate-x-20 -translate-y-20" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          
          {/* Large Diagonal Band */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent transform -skew-y-12 origin-top-left" /> */}
          
          {/* Middle Triangle */}
          {/* <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-secondary/20 to-transparent transform rotate-45" /> */}
          
          {/* Bottom Accent */}
          {/* <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/30 to-transparent" /> */}
          
          {/* Decorative Circles */}
          {/* <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-white/10" /> */}
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 py-20 text-white w-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">LOGIN</h1>
            <p className="text-xl text-white/90">Welcome back to Ragly</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
