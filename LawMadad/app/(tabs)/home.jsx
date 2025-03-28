"use client"

import { useRef, useState, useEffect } from "react"
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  StatusBar, 
  StyleSheet 
} from "react-native"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  Easing, 
  withSpring, 
  FadeIn 
} from "react-native-reanimated"
import { addDoc, collection } from "firebase/firestore"
import { firestore, auth } from "../../Config/FirebaseConfig"
import Sidebar from "../../components/Home/Sidebar"
import Feedback from "../../components/Home/Feedback"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

const formatResponse = (text) => {
  const paragraphs = text.split("\n\n")
  return paragraphs.map((paragraph) => {
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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isQuerySelecting, setIsQuerySelecting] = useState(false)

  const scrollViewRef = useRef(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  // Sidebar & hammer icon animations
  const translateX = useSharedValue(-300)
  const hammerRotation = useSharedValue(0)
  const sidebarAnimatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] }
  })
  const hammerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -24 },
        { rotate: `${hammerRotation.value}deg` },
        { translateY: 24 }
      ]
    }
  })

  const toggleSidebar = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    translateX.value = withTiming(newIsOpen ? 0 : -300, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }

  const animateHammer = () => {
    hammerRotation.value = withSequence(
      withTiming(-45, { duration: 100 }),
      withSpring(0, { damping: 3, stiffness: 200 })
    )
  }

  const storeQueryInFirestore = async (userQuery, responseText) => {
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null
      const docRef = await addDoc(collection(firestore, "Query"), {
        userId: userId,
        user_query: userQuery,
        response: responseText,
        timestamp: new Date().toISOString()
      })
      console.log("Query stored with ID:", docRef.id)
    } catch (error) {
      console.error("Error storing query:", error)
    }
  }

  const handleSubmit = async () => {
    if (input.trim() === "") return

    animateHammer()
    const queryText = input
    const userMessage = {
      id: messages.length,
      content: queryText,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("https://ali4568-lawmadad.hf.space/query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const formattedResponse = formatResponse(data.response)

      const apiMessage = {
        id: messages.length + 1,
        content: formattedResponse,
        isUser: false,
      }

      setMessages((prev) => [...prev, apiMessage])
      await storeQueryInFirestore(queryText, data.response)
    } catch (error) {
      Alert.alert("Error", "There was an error processing your request. Please try again.")
      setMessages((prev) => [
        ...prev,
        { id: messages.length + 1, content: "Sorry, there was an error.", isUser: false },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
  }

  const handleQuerySelect = (queryItem) => {
    if (isQuerySelecting) return
    setIsQuerySelecting(true)

    let responseText = ""
    if (typeof queryItem.response === "string") {
      responseText = queryItem.response
    } else if (Array.isArray(queryItem.response)) {
      responseText = queryItem.response.join("\n\n")
    } else if (queryItem.response) {
      responseText = String(queryItem.response)
    }

    if (!responseText.trim()) {
      Alert.alert("No Response", "This query has no response available.")
      setIsQuerySelecting(false)
      return
    }

    let formattedResponse = formatResponse(responseText)
    if (!formattedResponse || formattedResponse.length === 0) {
      formattedResponse = [{ type: "paragraph", content: responseText }]
    }

    const timestamp = Date.now()
    const newChat = [
      {
        id: timestamp,
        content: queryItem.user_query,
        isUser: true,
      },
      {
        id: timestamp + 1,
        content: formattedResponse,
        isUser: false,
      }
    ]

    setMessages(newChat)

    setTimeout(() => {
      toggleSidebar()
      setIsQuerySelecting(false)
    }, 300)
  }

  const renderFormattedContent = (content) => {
    return content.map((item, index) => {
      switch (item.type) {
        case "header":
          return <Text key={index} style={styles.headerText}>{item.content}</Text>
        case "listItem":
          return <Text key={index} style={styles.listItemText}>• {item.content}</Text>
        case "paragraph":
          return <Text key={index} style={styles.paragraphText}>{item.content}</Text>
        default:
          return null
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
    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>Typing{dots}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Assistant</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <MaterialCommunityIcons name="chat-plus-outline" size={28} color="#007AFF" style={{ paddingRight: 8 }} />
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      <Sidebar toggleSidebar={toggleSidebar} animatedStyle={sidebarAnimatedStyles} onQuerySelect={handleQuerySelect} />

      {/* Chat */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        keyboardShouldPersistTaps="always"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <Animated.View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.apiMessage,
            ]}
            entering={FadeIn.duration(300)}
          >
            {message.isUser ? (
              <Text style={styles.messageText}>{message.content}</Text>
            ) : (
              <>
                {renderFormattedContent(message.content)}
                <Feedback queryId={message.id} />
              </>
            )}
          </Animated.View>
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask a legal question..."
          placeholderTextColor="#888"
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Animated.View style={hammerAnimatedStyles}>
            <FontAwesome name="balance-scale" size={24} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9f9f9" 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 20, 
    backgroundColor: "#fff", 
    borderBottomWidth: 1, 
    borderBottomColor: "#eaeaea", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  menuButton: { 
    position: "absolute", 
    left: 20 
  },
  headerTitle: { 
    color: "#333", 
    fontSize: 26, 
    fontWeight: "600", 
    textAlign: "center" 
  },
  newChatButton: { 
    position: "absolute", 
    right: 20 
  },
  chatContainer: { 
    padding: 20 
  },
  messageContainer: { 
    maxWidth: "80%", 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 15, 
    backgroundColor: "#fff", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  userMessage: { 
    alignSelf: "flex-end", 
    backgroundColor: "#DCF8C6" 
  },
  apiMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "#fff" 
  },
  messageText: { 
    color: "#333", 
    fontSize: 16, 
    lineHeight: 22 
  },
  headerText: { 
    color: "#333", 
    fontSize: 20, 
    fontWeight: "600", 
    marginBottom: 8 
  },
  paragraphText: { 
    color: "#333", 
    fontSize: 16, 
    marginBottom: 8, 
    lineHeight: 22 
  },
  listItemText: { 
    color: "#333", 
    fontSize: 16, 
    marginLeft: 20, 
    marginBottom: 6, 
    lineHeight: 22 
  },
  inputContainer: { 
    flexDirection: "row", 
    padding: 15, 
    backgroundColor: "#fff", 
    borderTopWidth: 1, 
    borderTopColor: "#eaeaea", 
    alignItems: "center" 
  },
  input: { 
    flex: 1, 
    backgroundColor: "#f1f1f1", 
    color: "#333", 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    fontSize: 16, 
    marginRight: 15 
  },
  submitButton: { 
    backgroundColor: "#007AFF", 
    borderRadius: 30, 
    width: 60, 
    height: 60, 
    justifyContent: "center", 
    alignItems: "center", 
    overflow: "hidden", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 3 
  },
  typingContainer: { 
    alignSelf: "flex-start", 
    padding: 15, 
    borderRadius: 20, 
    backgroundColor: "#f1f1f1", 
    marginBottom: 20 
  },
  typingText: { 
    color: "#333", 
    fontSize: 16 
  },
})

