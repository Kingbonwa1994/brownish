import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Modal, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppwriteClientFactory } from '@/services/appwrite/appwriteClient';
import { ID } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import PaystackView from '@/components/PaystackView';

// --------------------------
// Type Definitions
// --------------------------
interface Ticket {
    id: any;
    type?: string;
    description?: string;
    eventDate?: string;
    venue?: string;
    availableTickets?: number;
    owner?: string;
    price?: number[];
    gradient?: [string, string];
}

const database = AppwriteClientFactory.getInstance().database;

// Define an array of gradient colors to choose from.
// Explicitly type them as a tuple of at least two strings.
const gradientColors: [string, string][] = [
    ["#00c6ff", "#0072ff"],
    ["#ff7e5f", "#feb47b"],
    ["#6a3093", "#a044ff"],
    ["#1a2980", "#26d0ce"],
    ["#ee9ca7", "#ffdde1"],
];

const TicketScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // Updated newTicket state to include three price options
    const [newTicket, setNewTicket] = useState({ name: "", event: "", price1: "", price2: "", price3: "" });
    const [ticketTypes, setTicketTypes] = useState<Ticket[]>([]);

    // State for selected price to process via Paystack
    const [selectedTicketAmount, setSelectedTicketAmount] = useState<number | null>(null);
    const [paystackVisible, setPaystackVisible] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await database.listDocuments(
                    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                    process.env.EXPO_PUBLIC_APPWRITE_TICKETS_COLLECTION_ID!,
                    
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
                    gradient: gradientColors[Math.floor(Math.random() * gradientColors.length)],
                }));
                setTicketTypes(tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                Alert.alert("Error", "Failed to fetch tickets. Please try again.");
            }
        };

        fetchTickets();
    }, []);

    const addTicket = async () => {
        if (!newTicket.name || !newTicket.event || !newTicket.price1 || !newTicket.price2 || !newTicket.price3) {
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
            price: [
                parseFloat(newTicket.price1),
                parseFloat(newTicket.price2),
                parseFloat(newTicket.price3)
            ],
            gradient: gradientColors[Math.floor(Math.random() * gradientColors.length)],
        };

        try {
            const response = await database.createDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_TICKETS_COLLECTIONS_ID!,
                ID.unique(),
                newTicketItem
            );

            console.log("Ticket added successfully:", response);

            setTicketTypes((prevTickets) => [
                ...prevTickets,
                { ...newTicketItem, id: response.$id },
            ]);

            setModalVisible(false);
            setNewTicket({ name: "", event: "", price1: "", price2: "", price3: "" });
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
                    data={ticketTypes.filter(ticket =>
                        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <LinearGradient colors={item.gradient || ["#00c6ff", "#0072ff"]} style={styles.ticketCard}>
                            <View style={styles.ticketInfo}>
                                <Text style={styles.ticketType}>{item.type} Ticket</Text>
                                <Text style={styles.ticketDescription}>{item.description}</Text>
                                <Text style={styles.ticketEventDate}>{item.eventDate}</Text>
                                <Text style={styles.ticketVenue}>{item.venue}</Text>
                                <Text style={styles.ticketAvailableTickets}>Available Tickets: {item.availableTickets}</Text>
                                <Text style={styles.ticketOwner}>Owner: {item.owner}</Text>
                                <Text style={styles.ticketPrice}>Select Price:</Text>
                                <View style={styles.priceOptionsContainer}>
                                    {item.price && item.price.map((priceOption, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.priceOption}
                                            onPress={() => {
                                                setSelectedTicketAmount(priceOption);
                                                setPaystackVisible(true);
                                            }}
                                        >
                                            <Text style={styles.priceOptionText}>${priceOption}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </LinearGradient>
                    )}
                />

                <TouchableOpacity style={styles.addTicketButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addTicketText}>+ Add Ticket</Text>
                </TouchableOpacity>

                {/* Add Ticket Modal */}
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
                                placeholder="Price Option 1"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={newTicket.price1}
                                onChangeText={(text) => setNewTicket({ ...newTicket, price1: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Price Option 2"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={newTicket.price2}
                                onChangeText={(text) => setNewTicket({ ...newTicket, price2: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Price Option 3"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={newTicket.price3}
                                onChangeText={(text) => setNewTicket({ ...newTicket, price3: text })}
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

                {/* Paystack Payment Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={paystackVisible}
                    onRequestClose={() => setPaystackVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {selectedTicketAmount !== null && (
                                <PaystackView
                                    amount={selectedTicketAmount}
                                    onSuccess={(data) => {
                                        console.log("Payment successful", data);
                                        Alert.alert("Payment", "Payment was successful.");
                                        setPaystackVisible(false);
                                        setSelectedTicketAmount(null);
                                    }}
                                    onCancel={() => {
                                        console.log("Payment cancelled");
                                        setPaystackVisible(false);
                                        setSelectedTicketAmount(null);
                                    }}
                                />
                            )}
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
        padding: 20,
        borderRadius: 12,
        marginVertical: 10,
    },
    ticketInfo: {
        flex: 1,
    },
    ticketType: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
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
    ticketPrice: {
        fontSize: 16,
        color: "#fff",
        marginTop: 10,
    },
    priceOptionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    priceOption: {
        backgroundColor: "#333",
        padding: 8,
        borderRadius: 6,
        marginHorizontal: 4,
    },
    priceOptionText: {
        color: "#fff",
        fontSize: 16,
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
        textAlign: "center",
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
});