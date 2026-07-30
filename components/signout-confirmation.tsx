import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

// My Import
import { useAuth } from "@/context/AuthContext";

export function SignoutConfirmation() {
  // My Const
  const { signout } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button className="w-full" variant={"destructive"}>
            <LogOutIcon />
            Log out
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign Out?</AlertDialogTitle>
          <AlertDialogDescription>
            Your access to this account will be deleted, you need to Sign in
            again to regain your access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => signout()}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
