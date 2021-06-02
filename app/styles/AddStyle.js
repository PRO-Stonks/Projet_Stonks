import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        marginTop: '8%',
        fontSize: 30,
        fontWeight: 'bold',
    },
    bAdd: {
        marginTop: '8%',
        backgroundColor: 'darkseagreen',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        height: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDown: {
        backgroundColor: '#0e131e',
        padding: 20,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 22,
    },
    selection: {
        padding: 20,
        textAlign: 'center',
        fontSize: 28,
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
    },
});

export default styles;
