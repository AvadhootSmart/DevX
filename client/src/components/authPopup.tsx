"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { PasswordInput } from "./passwordInput";
import useUser from "../../store/user.store";
import { LInput } from "./Input";
import { loginUser, registerUser } from "@/api/auth";
import { LogIn } from "lucide-react";

export const AuthPopup = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setToken } = useUser();

  const loginTestUser = () => {
    setEmail("test@test.com");
    setPassword("test");
  };

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<"Register" | "Login">("Login");

  const handleRegister = async () => {
    const response = await registerUser(email, username, password);
    setEmail("");
    setPassword("");
    setUsername("");

    setUser(response.user);
  };
  const handleLogin = async () => {
    const response = await loginUser(email, password);
    setEmail("");
    setPassword("");

    setToken(response.token);
  };
  return (
    <>
      {type === "Register" ? (
        <Dialog>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold font-Montserrat">
                Create An Account
              </DialogTitle>
            </DialogHeader>
            <LInput
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <LInput
              isRequired
              placeholder="Enter your username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span className="text-black">
                <Button
                  variant={"link"}
                  className="p-0"
                  onClick={() => setType("Login")}
                >
                  Login
                </Button>
              </span>
            </p>
            <Button onClick={handleRegister}>Submit</Button>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle
                className="text-2xl font-semibold cursor-pointer"
                onDoubleClick={loginTestUser}
              >
                Login to your account
              </DialogTitle>
            </DialogHeader>
            <LInput
              isRequired
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500 flex gap-1 items-center">
              New here??{" "}
              <span className="text-black">
                <Button
                  variant={"link"}
                  className="p-0"
                  onClick={() => setType("Register")}
                >
                  Create an account
                </Button>
              </span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="text-black"></span>
            </p>
            <Button onClick={handleLogin}>Submit</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
