import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";



const ticketTypes = [
    { id: "1", type: "General", event: "Concert A", price: 50 },
    { id: "2", type: "VIP", event: "Concert A", price: 100 },
    { id: "3", type: "VVIP", event: "Concert B", price: 200 },
];

const TicketScreen = () => {
    const router = useRouter();
    const [cart, setCart] = useState<{ id: any; type?: string; price?: number; quantity?: number }[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newTicket, setNewTicket] = useState({ name: "", event: "", price: "" });

    const addToCart = (ticket: { id: any; type?: string; event?: string; price?: number; }) => {
        setCart((prevCart) => {
            const existingTicket = prevCart.find((item) => item.id === ticket.id);
            if (existingTicket) {
                return prevCart.map((item) =>
                    item.id === ticket.id ? { ...item, quantity: (item.quantity || 0 ) + 1 } : item
                );
            } else {
                return [...prevCart, { ...ticket, quantity: 1 }];
            }
        });
    };

    const addTicket = () => {
        if (newTicket.name && newTicket.event && newTicket.price) {
            ticketTypes.push({ id: String(ticketTypes.length + 1), type: newTicket.name, event: newTicket.event, price: parseFloat(newTicket.price) });
            setModalVisible(false);
            setNewTicket({ name: "", event: "", price: "" });
        }
    };

    return (
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
                data={ticketTypes.filter(ticket => ticket.event.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.ticketCard}>
                        <View style={styles.ticketInfo}>
                            <Text style={styles.ticketType}>{item.type} Ticket</Text>
                            <Text style={styles.ticketEvent}>{item.event}</Text>
                            <Text style={styles.ticketPrice}>${item.price}</Text>
                        </View>
                        <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
                            <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            />

            <TouchableOpacity style={styles.addTicketButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addTicketText}>+ Add Ticket</Text>
            </TouchableOpacity>

            {/* Bottom Sheet Modal for Adding Tickets */}
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
    ticketEvent: {
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
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
