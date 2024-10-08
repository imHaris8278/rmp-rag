"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const Appbar = () => {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTitle(document.title);
    }
  }, [title]);
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => theme.palette.emerald[700],
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/"} style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
            {title}
          </Typography>
        </Link>

        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Button color="inherit" href="/professors" variant="text">
            Professors
          </Button>
          <Button color="inherit" href="/contact-us" variant="text">
            Contact
          </Button>
          <SignedOut>
            <Button color="inherit" href="/sign-in" variant="text">
              Login
            </Button>
            <Button color="inherit" href="/sign-up" variant="text">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <Button color="inherit" href="/chat" variant="text">
              Chat
            </Button>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
