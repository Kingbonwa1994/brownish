import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Modal, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { AppwriteClientFactory } from '@/services/appwrite/appwriteClient';
import * as constants from '@/constants/appConstants'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ID } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

// --------------------------
// Type Definitions
// --------------------------

// Define the Ticket interface
interface Ticket {
    id: any;
    type?: string;
    description?: string;
    eventDate?: string;
    venue?: string;
    availableTickets?: number;
    owner?: string;
    price?: number[];
}

// Extend Ticket to include quantity for Cart items
interface CartItem extends Ticket {
    quantity: number;
}

const database = AppwriteClientFactory.getInstance().database;

const TicketScreen = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newTicket, setNewTicket] = useState({ name: "", event: "", price: "" });
    const [ticketTypes, setTicketTypes] = useState<Ticket[]>([
        {
            id: "",
            type: "",
            description: "",
            eventDate: "",
            venue: "",
            availableTickets: 0,
            owner: "",
            price: []
        },
    ]);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [totalAmount, setTotalAmount] = useState<number>(0); // State to store the total amount

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await database.listDocuments(
                    constants.TICKETS_COLLECTION_ID,
                    constants.DATABASE_ID,
                );
                const tickets = response.documents.map((doc: any) => ({
                    id: doc.$id,
                    type: doc.type,
                    description: doc.description,
                    eventDate: doc.eventDate,
                    venue: doc.venue,
                    availableTickets: doc.availableTickets,
                    owner: doc.owner,
                    price: doc.price,
                }));
                setTicketTypes(tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                Alert.alert("Error", "Failed to fetch tickets. Please try again.");
            }
        };

        fetchTickets();
    }, []);

    const addToCart = (ticket: Ticket) => {
        setCart((prevCart) => {
            const existingTicket = prevCart.find((item) => item.id === ticket.id);
            if (existingTicket) {
                return prevCart.map((item) =>
                    item.id === ticket.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
                );
            } else {
                return [...prevCart, { ...ticket, quantity: 1 }];
            }
        });
    };

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + ((item.price?.[0] || 0)) * (item.quantity || 1),
            0
        );
    };

    const handleCheckout = () => {
        const totalAmountValue = calculateTotal(); // Calculate total amount
        if (totalAmountValue > 0) {
            setTotalAmount(totalAmountValue); // Set the total amount state
            setCheckoutVisible(true); // Show the PayPal buttons
        } else {
            Alert.alert("Error", "Your cart is empty.");
        }
    };

    const addTicket = async () => {
        if (!newTicket.name || !newTicket.event || !newTicket.price) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const newTicketItem = {
            type: newTicket.name,
            description: newTicket.event,
            eventDate: new Date().toISOString(),
            venue: "Sample Venue",
            availableTickets: 100,
            owner: "Sample Owner",
            price: [parseFloat(newTicket.price)],
        };

        try {
            const response = await database.createDocument(
                constants.DATABASE_ID,
                constants.TICKETS_COLLECTION_ID,
                ID.unique(),
                newTicketItem
            );

            console.log("Ticket added successfully:", response);

            setTicketTypes((prevTickets) => [
                ...prevTickets,
                { ...newTicketItem, id: response.$id },
            ]);

            setModalVisible(false);
            setNewTicket({ name: "", event: "", price: "" });
        } catch (error) {
            console.error("Error adding ticket:", error);
            Alert.alert("Error", "Failed to add ticket. Please try again.");
        }
    };

    return (
        <SafeAreaView>
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by Event Name"
                placeholderTextColor="#ccc"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Text style={styles.header}>Buy & Sell Event Tickets</Text>
            <FlatList
                data={ticketTypes.filter(ticket => ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.ticketCard}>
                        <View style={styles.ticketInfo}>
                            <Text style={styles.ticketType}>{item.type} Ticket</Text>
                            <Text style={styles.ticketDescription}>{item.description}</Text>
                            <Text style={styles.ticketEventDate}>{item.eventDate}</Text>
                            <Text style={styles.ticketVenue}>{item.venue}</Text>
                            <Text style={styles.ticketAvailableTickets}>Available Tickets: {item.availableTickets}</Text>
                            <Text style={styles.ticketOwner}>Owner: {item.owner}</Text>
                            <Text style={styles.ticketPrice}>Price: ${item.price?.[0]}</Text>
                        </View>
                        <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
                            <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCheckout} style={styles.buyButton}> {/* Changed to handleCheckout */}
                            <Text style={styles.buyButtonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            />

            <TouchableOpacity style={styles.addTicketButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addTicketText}>+ Add Ticket</Text>
            </TouchableOpacity>


            {checkoutVisible && (
                <PayPalButtons
                        createOrder={(data, actions) =>
                            actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "USD", // set your desired currency
                                            value: totalAmount.toString(), // set the amount
                                        },
                                    },
                                ],
                                intent: "CAPTURE"
                            })
                        }
                        onApprove={(data, actions) => {
                            if (!actions.order) {
                                console.error("Order information is missing.");
                                setCheckoutVisible(false);
                                return Promise.resolve();
                            }
                            return actions.order.capture().then((details) => {
                                const payerName = details?.payer?.name?.given_name || "Unknown";
                                Alert.alert("Success", `Transaction completed by ${payerName}`);
                                setCheckoutVisible(false);
                                setCart([]);
                            });
                        }}
                        onError={(err: Record<string, unknown>) => {
                            Alert.alert("Error", "Transaction failed. Please try again.");
                            console.error("Transaction error:", err);
                            setCheckoutVisible(false);
                        }}
                        onCancel={() => {
                            Alert.alert("Cancelled", "Transaction cancelled.");
                            setCheckoutVisible(false);
                        }}
                    />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Ticket</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ticket Name"
                            placeholderTextColor="#ccc"
                            value={newTicket.name}
                            onChangeText={(text) => setNewTicket({ ...newTicket, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Event Name"
                            placeholderTextColor="#ccc"
                            value={newTicket.event}
                            onChangeText={(text) => setNewTicket({ ...newTicket, event: text })}
                        />
                        <TextInput
               style={styles.input}
                            placeholder="Price"
                            placeholderTextColor="#ccc"
                            keyboardType="numeric"
                            value={newTicket.price}
                            onChangeText={(text) => setNewTicket({ ...newTicket, price: text })}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={addTicket}>
                            <Text style={styles.modalButtonText}>Add Ticket</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        </SafeAreaView>
    );
};

export default TicketScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    searchInput: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    ticketCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderRadius: 12,
        marginVertical: 10,
    },
    ticketDescription: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    ticketEventDate: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    ticketVenue: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    ticketAvailableTickets: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    ticketOwner: {
        fontSize: 14,
        color: "#e0e0e0",
    },
    addTicketButton: {
        backgroundColor: "#673ab7",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    addTicketText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    checkoutButton: {
        backgroundColor: "#4CAF50",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    checkoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#121212",
        borderRadius: 8,
        padding: 20,
        width: "80%",
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff",
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#673ab7",
        borderRadius: 8,
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#d32f2f",
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    ticketInfo: {
        flex: 1,
    },
    ticketType: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    ticketPrice: {
        fontSize: 16,
        color: "#fff",
    },
    addButton: {
        backgroundColor: "#673ab7",
        padding: 10,
        borderRadius: 8,
    },
    buyButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 8,
    },
    buyButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});