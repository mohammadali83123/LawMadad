// "use client"

// import { useState, useEffect, useRef } from "react"
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   Alert,
//   StatusBar,
//   Platform,
// } from "react-native"
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSequence,
//   Easing,
//   withSpring,
// } from "react-native-reanimated"
// // Import Firestore methods and auth instance
// import { addDoc, collection } from "firebase/firestore"
// import { firestore, auth } from "../../Config/FirebaseConfig"
// // Import the Sidebar component
// import Sidebar from "../../components/Home/Sidebar"

// const formatResponse = (text) => {
//   const paragraphs = text.split("\n\n")
//   return paragraphs.map((paragraph) => {
//     if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
//       return { type: "header", content: paragraph.replace(/\*\*/g, "") }
//     } else if (paragraph === paragraph.toUpperCase() && paragraph.length > 3) {
//       return { type: "header", content: paragraph }
//     } else if (paragraph.startsWith("### ")) {
//       return { type: "header", content: paragraph.replace(/^### /, "").replace(/\*\*/g, "") }
//     } else if (paragraph.startsWith("* ")) {
//       return { type: "listItem", content: paragraph.substring(2) }
//     } else {
//       return { type: "paragraph", content: paragraph }
//     }
//   })
// }

// export default function Home() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)

//   const scrollViewRef = useRef(null)

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollToEnd({ animated: true })
//     }
//   }, [messages])

//   // Shared values for animation
//   const translateX = useSharedValue(-300)
//   const hammerRotation = useSharedValue(0)

//   // Animated style for the sidebar using the shared value
//   const sidebarAnimatedStyles = useAnimatedStyle(() => {
//     return { transform: [{ translateX: translateX.value }] }
//   })

//   // Animated style for the hammer (submit icon)
//   const hammerAnimatedStyles = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateY: -24 },
//         { rotate: `${hammerRotation.value}deg` },
//         { translateY: 24 }
//       ],
//     }
//   })

//   // Updated toggle function using a local variable.
//   const toggleSidebar = () => {
//     const newIsOpen = !isOpen
//     setIsOpen(newIsOpen)
//     translateX.value = withTiming(newIsOpen ? 0 : -300, {
//       duration: 300,
//       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//     })
//   }

//   const animateHammer = () => {
//     hammerRotation.value = withSequence(
//       withTiming(-45, { duration: 100 }),
//       withSpring(0, { damping: 3, stiffness: 200 })
//     )
//   }

//   // Helper to store query in Firestore
//   const storeQueryInFirestore = async (userQuery, responseText) => {
//     try {
//       const userId = auth.currentUser ? auth.currentUser.uid : null
//       const docRef = await addDoc(collection(firestore, "Query"), {
//         userId: userId,
//         user_query: userQuery,
//         response: responseText,
//         timestamp: new Date().toISOString()
//       })
//       console.log("Query stored with ID:", docRef.id)
//     } catch (error) {
//       console.error("Error storing query:", error)
//     }
//   }

//   const handleSubmit = async () => {
//     if (input.trim() === "") return

//     animateHammer()

//     // Save the current query text before clearing the input
//     const queryText = input

//     const userMessage = {
//       id: messages.length,
//       content: queryText,
//       isUser: true,
//     }

//     setMessages((prevMessages) => [...prevMessages, userMessage])
//     setInput("")
//     setIsLoading(true)
//     setIsTyping(true)

//     try {
//       const response = await fetch("https://ali4568-lawmadad.hf.space/query/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: queryText }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       const formattedResponse = formatResponse(data.response)

//       const apiMessage = {
//         id: messages.length + 1,
//         content: formattedResponse,
//         isUser: false,
//       }

//       setMessages((prevMessages) => [...prevMessages, apiMessage])
//       await storeQueryInFirestore(queryText, data.response)
//     } catch (error) {
//       showAlert("Error", "There was an error processing your request. Please try again.")
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { id: messages.length + 1, content: "Sorry, there was an error.", isUser: false },
//       ])
//     } finally {
//       setIsLoading(false)
//       setIsTyping(false)
//     }
//   }

//   const showAlert = (title, message) => {
//     Alert.alert(title, message)
//   }

//   const renderFormattedContent = (content) => {
//     return content.map((item, index) => {
//       switch (item.type) {
//         case "header":
//           return <Text key={index} style={styles.headerText}>{item.content}</Text>
//         case "listItem":
//           return <Text key={index} style={styles.listItemText}>• {item.content}</Text>
//         case "paragraph":
//           return <Text key={index} style={styles.paragraphText}>{item.content}</Text>
//         default:
//           return null
//       }
//     })
//   }

//   const TypingIndicator = () => {
//     const [dots, setDots] = useState("")
//     useEffect(() => {
//       if (isTyping) {
//         const interval = setInterval(() => {
//           setDots((prev) => (prev.length < 3 ? prev + "." : ""))
//         }, 500)
//         return () => clearInterval(interval)
//       }
//     }, [isTyping])
//     return (
//       <View style={styles.typingContainer}>
//         <Text style={styles.typingText}>Typing{dots}</Text>
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
//           <Text style={styles.iconText}>☰</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Legal Assistant</Text>
//       </View>

//       {/* Sidebar Component */}
//       <Sidebar toggleSidebar={toggleSidebar} animatedStyle={sidebarAnimatedStyles} />

//       <ScrollView
//         ref={scrollViewRef}
//         style={styles.chatContainer}
//         onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//       >
//         {messages.map((message) => (
//           <View
//             key={message.id}
//             style={[
//               styles.messageContainer,
//               message.isUser ? styles.userMessage : styles.apiMessage,
//             ]}
//           >
//             {message.isUser ? (
//               <Text style={styles.messageText}>{message.content}</Text>
//             ) : (
//               renderFormattedContent(message.content)
//             )}
//           </View>
//         ))}
//         {isTyping && <TypingIndicator />}
//       </ScrollView>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={input}
//           onChangeText={setInput}
//           placeholder="Ask a legal question..."
//           placeholderTextColor="#999"
//           editable={!isLoading}
//         />
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
//           <Animated.View style={hammerAnimatedStyles}>
//             <Text style={styles.iconText}>⚖️</Text>
//           </Animated.View>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1a1a1a",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     backgroundColor: "#2c2c2c",
//     position: "relative",
//   },
//   menuButton: {
//     position: "absolute",
//     left: 10,
//   },
//   headerTitle: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   chatContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   messageContainer: {
//     maxWidth: "80%",
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 25,
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#4a5568",
//   },
//   apiMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#2d3748",
//   },
//   messageText: {
//     color: "white",
//     fontSize: 16,
//   },
//   headerText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   paragraphText: {
//     color: "white",
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   listItemText: {
//     color: "white",
//     fontSize: 16,
//     marginLeft: 16,
//     marginBottom: 4,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 8,
//     backgroundColor: "#2c2c2c",
//   },
//   input: {
//     flex: 1,
//     backgroundColor: "#3a3a3a",
//     color: "white",
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     marginRight: 12,
//   },
//   submitButton: {
//     backgroundColor: "#8b4513",
//     borderRadius: 24,
//     width: 48,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   typingContainer: {
//     alignSelf: "flex-start",
//     padding: 12,
//     borderRadius: 16,
//     backgroundColor: "#2d3748",
//     marginBottom: 25,
//   },
//   typingText: {
//     color: "white",
//     fontSize: 16,
//   },
//   iconText: {
//     color: "white",
//     fontSize: 24,
//   },
// })



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
// Import Firestore methods and auth instance
import { addDoc, collection } from "firebase/firestore"
import { firestore, auth } from "../../Config/FirebaseConfig"
// Import the Sidebar component
import Sidebar from "../../components/Home/Sidebar"

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

  const scrollViewRef = useRef(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  // Shared values for animation
  const translateX = useSharedValue(-300)
  const hammerRotation = useSharedValue(0)

  // Animated style for the sidebar using the shared value
  const sidebarAnimatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] }
  })

  // Animated style for the hammer (submit icon)
  const hammerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -24 },
        { rotate: `${hammerRotation.value}deg` },
        { translateY: 24 }
      ],
    }
  })

  // Updated toggle function using a local variable.
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

  // Helper to store query in Firestore
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

    // Save the current query text before clearing the input
    const queryText = input

    const userMessage = {
      id: messages.length,
      content: queryText,
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

      setMessages((prevMessages) => [...prevMessages, apiMessage])
      await storeQueryInFirestore(queryText, data.response)
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

  const handleNewChat = () => {
    // Clear messages to start a new chat
    setMessages([])
  }

  const showAlert = (title, message) => {
    Alert.alert(title, message)
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
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal Assistant</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <Text style={styles.newChatIcon}>✚</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar Component */}
      <Sidebar toggleSidebar={toggleSidebar} animatedStyle={sidebarAnimatedStyles} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.apiMessage,
            ]}
          >
            {message.isUser ? (
              <Text style={styles.messageText}>{message.content}</Text>
            ) : (
              renderFormattedContent(message.content)
            )}
          </View>
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask a legal question..."
          placeholderTextColor="#999"
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Animated.View style={hammerAnimatedStyles}>
            <Text style={styles.iconText}>⚖️</Text>
          </Animated.View>
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
  newChatButton: {
    position: "absolute",
    right: 10,
  },
  newChatIcon: {
    color: "white",
    fontSize: 24,
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
