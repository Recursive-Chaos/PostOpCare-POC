import { fireEvent, render } from "@testing-library/react-native";
import { CheckinQuestionField } from "./CheckinQuestionField";
import { t } from "@shared/translations";

const baseProps = {
  value: "",
  onChange: jest.fn(),
  onPickPhoto: jest.fn(),
  onTakePhoto: jest.fn(),
};

describe("CheckinQuestionField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("randareaza optiunile pentru choice", () => {
    const { getByText } = render(
      <CheckinQuestionField
        {...baseProps}
        question={{
          id: "wound",
          text: "Aspect plaga",
          type: "choice",
          options: ["Normal", "Rosu"],
        }}
      />,
    );

    fireEvent.press(getByText("Rosu"));

    expect(baseProps.onChange).toHaveBeenCalledWith("Rosu");
  });

  it("foloseste butoane pentru scala mica", () => {
    const { getByText } = render(
      <CheckinQuestionField
        {...baseProps}
        question={{
          id: "pain",
          text: "Durere",
          answerType: "scale",
          optionsJson: { min: 1, max: 3 },
        }}
      />,
    );

    fireEvent.press(getByText("3"));

    expect(baseProps.onChange).toHaveBeenCalledWith("3");
  });

  it("foloseste input numeric pentru scala mare", () => {
    const { getByPlaceholderText } = render(
      <CheckinQuestionField
        {...baseProps}
        question={{
          id: "score",
          text: "Scor",
          answerType: "scale",
          optionsJson: { min: 1, max: 20 },
        }}
      />,
    );

    fireEvent.changeText(getByPlaceholderText("1-20"), "14");

    expect(baseProps.onChange).toHaveBeenCalledWith("14");
  });

  it("creste valoarea numerica cu pasul setat", () => {
    const { getByText } = render(
      <CheckinQuestionField
        {...baseProps}
        value="36.8"
        question={{
          id: "temperature",
          text: "Temperatura",
          answerType: "scale",
          optionsJson: { min: 35, max: 42, step: 0.1, unit: "C" },
        }}
      />,
    );

    fireEvent.press(getByText("+"));

    expect(baseProps.onChange).toHaveBeenCalledWith("36.9");
  });

  it("apeleaza camera si galeria pentru poza", () => {
    const { getByText } = render(
      <CheckinQuestionField
        {...baseProps}
        question={{ id: "photo", text: "Poza", type: "photo" }}
      />,
    );

    fireEvent.press(getByText(t("checkinCameraBtn")));
    fireEvent.press(getByText(t("checkinGalleryBtn")));

    expect(baseProps.onTakePhoto).toHaveBeenCalled();
    expect(baseProps.onPickPhoto).toHaveBeenCalled();
  });
});
