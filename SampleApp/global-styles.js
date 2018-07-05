import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    screenTitleContainer: {
        backgroundColor: "#ddddff",
        alignItems: "center",
        alignSelf: "stretch",
    },
    screenTitleText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
    },
    commandButtonsContainer: {
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent:"space-around",
        alignItems: "center",
        marginVertical: 5,
    },
});

export default styles;