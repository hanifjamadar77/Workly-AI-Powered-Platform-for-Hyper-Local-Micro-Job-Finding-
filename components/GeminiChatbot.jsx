import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API_KEY = "AIzaSyAvO4QRvfbX9dxhxvJcLkMtWyq9JcVP7hE";

const WORKLY_SYSTEM_PROMPT = `You are Luci, an intelligent AI assistant for Workly - a workforce management and job platform. 

Your role is to help users with:
1. Job listings and opportunities
2. Profile management and applications
3. Work scheduling and shifts
4. Payment and earnings information
5. App features and how to use them
6. General workforce-related questions

Important Guidelines:
- Be friendly, professional, and helpful
- Provide clear, concise answers
- If a question is outside Workly's scope, politely redirect to Workly-related topics
- Always mention relevant Workly features when applicable
- Be empathetic to worker concerns

When users ask about:
- Jobs: Explain how to browse, filter, and apply for jobs on Workly
- Profile: Guide them on updating skills, experience, and availability
- Payments: Explain the payment system, withdrawal process, and earnings tracking
- Technical issues: Provide troubleshooting steps or suggest contacting support`;

const SUGGESTION_QUESTIONS = [
  "How do I find and apply for jobs?",
  "How do I update my profile?",
  "When will I get paid?",
  "How do I manage my availability?",
  "How do I contact support?",
];

const GeminiChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Luci, your AI assistant on Workly. I'm here to help you find jobs, manage your profile, and answer any questions about the platform. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(messages.length <= 1);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend || isLoading) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      conversationHistory.push({
        role: "user",
        parts: [{ text: textToSend }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData?.error?.message || "Failed to get response from API"
        );
      }

      const data = await response.json();
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResponse) {
        const assistantMessage = {
          role: "assistant",
          content: textResponse,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("No response from Gemini API");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry! I'm having trouble connecting. Please check your internet connection and try again. If the problem persists, contact Workly support.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Luci</Text>
            <Text style={styles.headerSubtitle}>Workly AI Assistant</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatContent}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Initial Greeting */}
            {messages.length === 1 && (
              <View style={styles.greetingContainer}>
                <View style={styles.greetingIcon}>
                  <Text style={styles.greetingEmoji}>👋</Text>
                </View>
                <Text style={styles.greetingText}>Welcome to Workly!</Text>
                <Text style={styles.greetingSubtext}>
                  Ask me anything about jobs, payments, or how to use the app
                </Text>
              </View>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.messageBubble,
                  msg.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === "user"
                      ? styles.userMessageText
                      : styles.assistantMessageText,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantMessage]}>
                <View style={styles.loadingDots}>
                  <View style={styles.dot}></View>
                  <View style={styles.dot}></View>
                  <View style={styles.dot}></View>
                </View>
              </View>
            )}

            {/* Suggestion Questions */}
            {showSuggestions && messages.length === 1 && !isLoading && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggested questions:</Text>
                {SUGGESTION_QUESTIONS.map((question, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => sendMessage(question)}
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                    <Text style={styles.suggestionArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#999"
                multiline
                editable={!isLoading}
                maxLength={500}
              />
              <TouchableOpacity
                onPress={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                style={[
                  styles.sendButton,
                  (isLoading || !input.trim()) && styles.sendButtonDisabled,
                ]}
              >
                <Text style={styles.sendButtonText}>➤</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>Powered by Workly AI</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#5B7FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  greetingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  greetingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingEmoji: {
    fontSize: 40,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  greetingSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20,
  },
  messageBubble: {
    maxWidth: "85%",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: "#5B7FFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
    fontWeight: "500",
  },
  assistantMessageText: {
    color: "#1F2937",
    fontWeight: "400",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
  },
  suggestionsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  suggestionButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  suggestionArrow: {
    fontSize: 16,
    color: "#5B7FFF",
    marginLeft: 8,
  },
  inputSection: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    color: "#1F2937",
    fontWeight: "500",
  },
  sendButton: {
    backgroundColor: "#5B7FFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B7FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputHint: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});

export default GeminiChatbot;
