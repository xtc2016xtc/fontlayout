import { Button, Dialog,DialogDescription, DialogHeader,DialogTitle, DialogTrigger, } from "@/components/ui";

 const home = () => {
  return (
    <div>
      <DialogTrigger>
      <Button>登录</Button>
      <Dialog>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </Dialog>
    </DialogTrigger>
        </div>
  );
}

export default home;