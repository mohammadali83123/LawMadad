"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from "react-native-reanimated"

type FormattedContent = {
  type: "header" | "listItem" | "paragraph"
  content: string
}

const formatResponse = (text: string): FormattedContent[] => {
  const paragraphs = text.split("\n\n")
  return paragraphs.map((paragraph): FormattedContent => {
    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
      return { type: "header", content: paragraph.replace(/\*\*/g, "") }
    } else if (paragraph === paragraph.toUpperCase() && paragraph.length > 3) {
      return { type: "header", content: paragraph }
    } else if (paragraph.startsWith("### ")) {
      return { type: "header", content: paragraph.replace(/^### /, "").replace(/\*\*/g, "") }
    } else if (paragraph.startsWith("* ")) {
      return { type: "listItem", content: paragraph.substring(2) }
    } else {
      return { type: "paragraph", content: paragraph }
    }
  })
}

type Message = {
  id: number
  content: string | FormattedContent[]
  isUser: boolean
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const translateX = useSharedValue(-300)
  const hammerRotation = useSharedValue(0)

  const sidebarAnimatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] }
  })

  const hammerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -24 }, { rotate: `${hammerRotation.value}deg` }, { translateY: 24 }],
    }
  })

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
    translateX.value = withTiming(isOpen ? -300 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }

  const animateHammer = () => {
    hammerRotation.value = withSequence(
      withTiming(-45, { duration: 100 }),
      withSpring(0, { damping: 3, stiffness: 200 }),
    )
  }

  const handleSubmit = async () => {
    if (input.trim() === "") return

    animateHammer()

    const userMessage: Message = {
      id: messages.length,
      content: input,
      isUser: true,
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("https://ali4568-lawmadad.hf.space/query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const formattedResponse = formatResponse(data.response)

      const apiMessage: Message = {
        id: messages.length + 1,
        content: formattedResponse,
        isUser: false,
      }

      setMessages((prevMessages) => [...prevMessages, apiMessage])
    } catch (error) {
      showAlert("Error", "There was an error processing your request. Please try again.")
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: messages.length + 1, content: "Sorry, there was an error.", isUser: false },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message)
  }

  const renderFormattedContent = (content: FormattedContent[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case "header":
          return <Text key={index} style={styles.headerText}>{item.content}</Text>
        case "listItem":
          return <Text key={index} style={styles.listItemText}>• {item.content}</Text>
        case "paragraph":
          return <Text key={index} style={styles.paragraphText}>{item.content}</Text>
      }
    })
  }

  const TypingIndicator = () => {
    const [dots, setDots] = useState("")
    useEffect(() => {
      if (isTyping) {
        const interval = setInterval(() => {
          setDots((prev) => (prev.length < 3 ? prev + "." : ""))
        }, 500)
        return () => clearInterval(interval)
      }
    }, [isTyping])
    return <View style={styles.typingContainer}><Text style={styles.typingText}>Typing{dots}</Text></View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Assistant</Text>
      </View>
      <Animated.View style={[styles.sidebar, sidebarAnimatedStyles]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}><Text style={styles.iconText}>✕</Text></TouchableOpacity>
        <Text style={styles.sidebarTitle}>Menu</Text>
      </Animated.View>
      <ScrollView ref={scrollViewRef} style={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.apiMessage]}>
            {message.isUser ? <Text style={styles.messageText}>{message.content as string}</Text> : renderFormattedContent(message.content as FormattedContent[])}
          </View>
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask a legal question..." placeholderTextColor="#999" editable={!isLoading} />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Animated.View style={hammerAnimatedStyles}><Text style={styles.iconText}>⚖️</Text></Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#2c2c2c",
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    left: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#2c2c2c",
    padding: 30,
    zIndex: 1000,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  sidebarTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  sidebarItemText: {
    color: "white",
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 25,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4a5568",
  },
  apiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2d3748",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraphText: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  listItemText: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#2c2c2c",
  },
  input: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    color: "white",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: "#8b4513",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  typingContainer: {
    alignSelf: "flex-start",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#2d3748",
    marginBottom: 25,
  },
  typingText: {
    color: "white",
    fontSize: 16,
  },
  iconText: {
    color: "white",
    fontSize: 24,
  },
})