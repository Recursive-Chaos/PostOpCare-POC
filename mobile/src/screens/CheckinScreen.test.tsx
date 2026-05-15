import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import CheckinScreen from "./CheckinScreen";
import { Questionnaire } from "../types";
import { t } from "@shared/translations";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

const questionnaire: Questionnaire = {
  assignmentId: 4,
  procedureId: 2,
  title: "Check-in test",
  status: "Necompletat",
  questions: [
    {
      id: "pain",
      text: "Durere",
      type: "scale",
      min: 1,
      max: 3,
      required: true,
      dbTarget: "measurement",
      metricName: "pain",
    },
    { id: "notes", text: "Note", type: "text" },
  ],
};

describe("CheckinScreen", () => {
  it("nu trimite daca lipseste raspuns obligatoriu", () => {
    const onDone = jest.fn();
    const { getByText } = render(
      <CheckinScreen
        questionnaire={questionnaire}
        onBack={jest.fn()}
        onDone={onDone}
      />,
    );

    fireEvent.press(getByText(t("checkinSubmitBtn")));

    expect(getByText(t("checkinRequiredError"))).toBeTruthy();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("trimite dupa ce raspunsul obligatoriu este completat", () => {
    const onDone = jest.fn();
    const { getByText } = render(
      <CheckinScreen
        questionnaire={questionnaire}
        onBack={jest.fn()}
        onDone={onDone}
      />,
    );

    fireEvent.press(getByText("2"));
    fireEvent.press(getByText(t("checkinSubmitBtn")));

    expect(onDone).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledWith({
      procedure_id: 2,
      submitted_at: expect.any(String),
      measurements: [{ metric_name: "pain", metric_value: 2 }],
      responses: [],
      photos: [],
    });
  });
});
