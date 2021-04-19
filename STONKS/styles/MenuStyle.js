import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    buttonsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    bodyContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
    },
    bText: {
        fontSize: 25,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bVisualize: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightskyblue',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bAdd: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkseagreen',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bSupress: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightsalmon',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
});

export default styles;
