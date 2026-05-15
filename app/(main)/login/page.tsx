import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-xxl px-gutter bg-gradient-animated relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] animate-float opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[100px] animate-float-delayed opacity-50 pointer-events-none"></div>

      <div className="glass-panel-premium p-xl rounded-2xl w-full max-w-[400px] shadow-[0_0_50px_rgba(0,242,255,0.1)] flex flex-col items-center animate-fade-in-up relative z-10 border border-white/5 backdrop-blur-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-container/30 to-primary-container/5 flex items-center justify-center border border-primary/40 shadow-[0_0_30px_rgba(0,242,255,0.2)] mb-md rotate-3 hover:rotate-0 transition-transform duration-500">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ textShadow: '0 0 10px rgba(0,242,255,0.8)' }}>login</span>
        </div>
        {/* Title/subtitle are inside LoginForm so they can read context */}
        <LoginForm />
      </div>
    </div>
  );
}
