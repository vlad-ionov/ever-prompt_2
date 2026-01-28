import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ theme = "dark", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        style: {
          zIndex: 9999,
        },
        classNames: {
          toast: "premium-toast group !bg-[#0f0f12]/90 !backdrop-blur-xl !text-white !border-white/5 !shadow-2xl !rounded-2xl !pointer-events-auto",
          success: "premium-toast-success !border-emerald-500/20 !bg-emerald-500/5",
          error: "premium-toast-error !border-rose-500/20 !bg-rose-500/5",
          info: "premium-toast-info !border-blue-500/20 !bg-blue-500/5",
          description: "group-data-[type=error]:text-rose-200/70 group-data-[type=success]:text-emerald-200/70",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
