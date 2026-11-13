"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import { PasswordInput } from "./passwordInput";
import useUser from "../../store/user.store";
import { LInput } from "./Input";
import { loginUser, registerUser } from "@/api/auth";
import { Loader2 } from "lucide-react";

type AuthMode = "Register" | "Login";

export const AuthPopup = ({ children }: { children: React.ReactNode }) => {
  const { setToken } = useUser();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mode, setMode] = useState<AuthMode>("Login");
  const [pending, setPending] = useState(false);

  const loginTestUser = () => {
    setEmail("test@test.com");
    setPassword("test");
  };

  const handleRegister = async () => {
    // registerUser toasts its own success/failure and returns undefined on failure
    const response = await registerUser(email, username, password);
    if (!response) return;
    // Registration doesn't issue a token, so hand off to login with the email kept
    setPassword("");
    setUsername("");
    setMode("Login");
  };

  const handleLogin = async () => {
    // loginUser toasts its own success/failure and returns undefined on failure
    const response = await loginUser(email, password);
    if (!response?.token) return;
    setEmail("");
    setPassword("");
    setToken(response.token);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      await (mode === "Register" ? handleRegister() : handleLogin());
    } finally {
      setPending(false);
    }
  };

  const isRegister = mode === "Register";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-semibold"
            onDoubleClick={isRegister ? undefined : loginTestUser}
          >
            {isRegister ? "Create an account" : "Log in to your account"}
          </DialogTitle>
          <DialogDescription>
            {isRegister
              ? "Sign up to submit solutions and track your progress."
              : "Welcome back. Log in to submit solutions."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LInput
            isRequired
            placeholder="you@example.com"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type={isRegister ? "email" : "text"}
            autoComplete="email"
          />
          {isRegister && (
            <LInput
              isRequired
              placeholder="Pick a username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              autoComplete="username"
            />
          )}
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isRegister ? "Create account" : "Log in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => setMode(isRegister ? "Login" : "Register")}
          >
            {isRegister ? "Log in" : "Create an account"}
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};
