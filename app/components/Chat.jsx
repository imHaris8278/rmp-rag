import { useUser } from "@clerk/nextjs";
import { Send } from "@mui/icons-material";
import {
    Box,
    Container,
    IconButton,
    InputBase,
    Paper,
    Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import theme from "../theme";

const Chat = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, router, user]);

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box>
      <Stack
        direction={"column"}
        spacing={2}
        flexGrow={1}
        overflow="auto"
        height={"80vh"}
        padding={2}
      >
        {messages.map((message, index) => (
          <Box key={index}>
            <Container maxWidth="sm">
              <Box
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? theme.palette.snuff[600]
                      : theme.palette.snuff[500]
                  }
                  borderRadius={3}
                  sx={{
                    p: "12px 15px",
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            </Container>
          </Box>
        ))}
      </Stack>
      <Stack
        direction={"row"}
        spacing={2}
        sx={{
          position: "fixed",
          width: "-webkit-fill-available",
          bottom: "0",
          padding: 2,
        }}
      >
        <Paper
          sx={{
            margin: "5px",
            p: "4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: { sm: "100%" },
            backgroundColor: theme.palette.snuff[700],
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
            border: `2px solid ${theme.palette.snuff[600]}`,
            borderRadius: 2,
          }}
        >
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "16px",
              color: theme.palette.snuff[50],
            }}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px", color: theme.palette.snuff[50] }}
            onClick={sendMessage}
          >
            <Send />
          </IconButton>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Chat;
