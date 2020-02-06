import React from "react";

import { Document, Text, Page, View, StyleSheet } from "@react-pdf/renderer";

const PrintPage = ({ routes }) => {
  console.log(routes);
  return (
    <Document>
      <Page>
        {routes.map((route) => (
          <View>
            <Text>{route.name}</Text>
            <Text>{route.description}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PrintPage;
