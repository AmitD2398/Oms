import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function OrderRefund({ navigation }) {
  return (
    <ScreenWrapper>
      <View style={[styles.headerView]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../../assets/images/backArrow.png")}
          />
        </Pressable>
        {/* <Text style={styles.headerText}>Purchase Orders</Text> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewIntoScrollView}>
          <View style={styles.productDetailsView}>
            <View style={styles.orderImageAndTextRow}>
              <View style={styles.orderImageView}>
                <Image
                  resizeMode="stretch"
                  style={styles.orderImage}
                  // source={require("../../assets/images/nowOrNeverList.png")}
                />
              </View>
              <View style={styles.orderTextView}>
                <Text numberOfLines={1} style={styles.orderTitle}>
                  Vero Moda
                </Text>
                <Text numberOfLines={1} style={styles.orderDesc}>
                  Blue & red stirps dress
                </Text>
                <Text style={styles.orderDesc}>Size: M</Text>
                <View style={{ flexDirection: "row", marginTop: 7 }}>
                  <Image
                    resizeMode="contain"
                    style={styles.refundProcessedImage}
                    source={require("../../assets/images/deliveredImage.png")}
                  />
                  <View style={{}}>
                    <Text
                      numberOfLines={1}
                      style={[styles.refundProcessedText]}
                    >
                      Refund Processed
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={styles.refundProcessedSubtext}
                    >
                      On Wed, 13 Jul
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.horizontalLine}></View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}>Order date</Text>
              <Text style={styles.orderDetailValue}>10 Jul 2022</Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}> Order ID</Text>
              <Text style={styles.orderDetailValue}>#7283-2323-23233</Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}>Order Total</Text>
              <Text style={styles.orderDetailValue}>Rs 1399.99 ( 1 Item)</Text>
            </View>
          </View>

          <View style={styles.refundDetailsContainer}>
            <Text style={styles.deliveryAddressHeading}>Refund details</Text>
            <View style={[styles.horizontalLine, { marginVertical: 0 }]}></View>
            <View style={{ padding: 10 }}>
              <View style={styles.nameAndMobileView}>
                <Text style={styles.refundAmountKey}>Total refund amount</Text>
                <Text style={styles.refundAmount}>Rs. 1399.00</Text>
              </View>
              <View style={styles.paymentMethodView}>
                <Image
                  resizeMode="contain"
                  style={styles.paymentMethodImage}
                  source={require("../../assets/images/paymentMethod.png")}
                />
                <Text style={styles.textUnderHeading}>
                  Added to ICICI card Ending xxx9990, credit by Tue, 16 July
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.borderContainer, { marginBottom: 30 }]}>
            <View style={styles.priceDetailHeadingView}>
              <Text style={styles.headingText}>Total Order Price</Text>
              <Text style={styles.headingText}>Rs. 1518.00</Text>
            </View>
            <Text style={styles.textUnderHeading}>
              You saved Rs. 599 on this order
            </Text>
            <View style={[styles.horizontalLine, { marginVertical: 4 }]}></View>
            <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Item Total</Text>
              <Text style={styles.rowTextStyle}>Rs. 1518.00</Text>
            </View>
            <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Discounted Price</Text>
              <Text style={styles.rowTextStyle}>Rs. 1518.00</Text>
            </View>
            <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Coupon discount</Text>
              <Text style={styles.rowTextStyle}>Rs. 0.00</Text>
            </View>
            <View style={styles.textRowView}>
              <Text style={styles.totalAmountText}>Total Paid</Text>
              <Text style={styles.totalAmountText}>Rs. 1518.00</Text>
            </View>
            <View style={styles.paymentMethodView}>
              <Image
                resizeMode="contain"
                style={styles.paymentMethodImage}
                source={require("../../assets/images/paymentMethod.png")}
              />
              <Text style={styles.textUnderHeading}>
                Paid by ICICI card Ending xxx9990
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    alignSelf: "center",
    backgroundColor: "rgba(22, 27, 47, 0.15)",
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
  headerView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
  },
  viewIntoScrollView: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  productDetailsView: {
    backgroundColor: "#F2F5F6",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  orderImageAndTextRow: {
    height: 110,
    alignItems: "center",
    flexDirection: "row",
  },
  orderImageView: {
    width: "25%",
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  orderImage: {
    width: "100%",
    height: "100%",
  },
  orderTextView: {
    width: "75%",
    height: "100%",
    padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
  },
  orderTitle: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
    marginVertical: 1,
  },
  orderDesc: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
    marginVertical: 1,
  },
  refundProcessedImage: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  refundProcessedText: {
    color: "#161B2F",
    fontSize: 13,
    fontFamily: "OpenSans-SemiBold",
  },
  refundProcessedSubtext: {
    color: "rgba(100, 100, 100, 0.7)",
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  orderDetailKey: {
    fontSize: 13,
    color: "#161B2F",
    fontFamily: "OpenSans-SemiBold",
  },
  orderDetailValue: {
    fontSize: 13,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    width: "65%",
  },

  //////////
  refundDetailsContainer: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 5,
  },
  deliveryAddressHeading: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    margin: 10,
  },
  nameAndMobileView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refundAmountKey: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  refundAmount: {
    color: "#1AA235",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
  },

  ///////////
  borderContainer: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  priceDetailHeadingView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
  },
  textUnderHeading: {
    width: "90%",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "rgba(100, 100, 100, 0.7)",
  },
  textRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "#646464",
    marginVertical: 2,
  },
  totalAmountText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#161B2F",
    marginVertical: 2,
  },
  paymentMethodView: {
    backgroundColor: "#F2F5F6",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
  },
  paymentMethodImage: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
});
