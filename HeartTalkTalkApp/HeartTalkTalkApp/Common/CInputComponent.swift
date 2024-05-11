import SwiftUI

extension CInputComponent {
    enum InputRegex:String {
        case emailRegex = "[0-9a-zA-Z]{3,20}@[0-9a-zA-Z]{2,15}(.[0-9a-zA-Z]{2,15})+"
        case passwordRegex = "[0-9a-zA-Z\\[\\]\\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)\\-~`!@#%&_=|{}:;\"'<,>/]{8,15}"
        case nameRegex = "[가-힣]{2,5}"
        
        var predicate: NSPredicate {
            return NSPredicate(format: "SELF MATCHES %@", self.rawValue)
        }
        
        func checkValidation(value: String) -> Bool {
            return self.predicate.evaluate(with: value)
        }
    }
    
    enum InputType {
        case email
        case password
        case name
        
        var errorMessage: String {
            switch(self) {
            case .email: return "이메일 형식을 확인해주세요"
            case .password: return "비밀번호는 8~15 자리 입니다"
            case .name: return "이름 형식에 맞지 않습니다"
            }
        }
        
        var successMessage: String {
            switch(self) {
            case .email: return "올바른 이메일 입력입니다"
            case .password: return "올바른 비밀번호 입력입니다"
            case .name: return "올바른 이름 입력입니다"
            }
        }
        
        var inputIconImage: Image.Icon? {
            switch(self) {
            case .email: return Image.Icon.email
            case .password: return Image.Icon.password
            case .name: return nil
            }
        }
    }
    
    struct InputError {
        var onError: Bool
        var errorMessage: String
    }
    
    struct InputSuccess {
        var onSuccess: Bool
        var successMessage: String
    }
    
    func checkResult(inputValue: String, inputType: InputType) -> Bool {
        switch(inputType) {
        case .email: InputRegex.emailRegex.checkValidation(value: inputValue)
        case .password: InputRegex.passwordRegex.checkValidation(value: inputValue)
        case .name: InputRegex.nameRegex.checkValidation(value: inputValue)
            
        }
    }
}

struct CInputComponent: View {
    @Binding var inputValue: String
    @Binding var onError: InputError?
    @Binding var onSuccess: InputSuccess?
    
    var inputType: InputType = .email
    var label: String = "label"
    var placeholder: String = "placeholder"
    var isNeededValue: Bool = false
    
    @State var inputFocused: Bool = false
    
    private var errorInfo: InputError? {
        if(self.onError != nil) {
            return onError
        }
        
        if(!inputValue.isEmpty && !self.checkResult(inputValue: self.inputValue, inputType: inputType)) {
            return InputError(onError: true, errorMessage: self.inputType.errorMessage)
        }
        
        return nil
    }
    
    private var successInfo: InputSuccess? {
        if(self.onSuccess != nil) {
            return self.onSuccess
        }
        
        if(!inputValue.isEmpty && self.checkResult(inputValue: inputValue, inputType: inputType)) {
            return InputSuccess(onSuccess: true, successMessage: inputType.successMessage)
        }
        
        return nil
    }
    
    private var inputLabelView: some View {
        Text(self.label)
            .font(
                Font.getCustomFontStyle(
                    customFont: .roboto,
                    fontWeight: .semibold,
                    size: 12
                )
            )
    }
    
    private var inputFieldView: some View {
        HStack {
            if let icon = self.inputType.inputIconImage {
                Image(icon.rawValue)
            }
            
            if(self.inputType == .password) {
                SecureField(
                    self.placeholder,
                    text: self.$inputValue
                )
            } else {
                TextField(
                    self.placeholder,
                    text: self.$inputValue,
                    onEditingChanged: {self.inputFocused = $0}
                )
            }
        }
        .frame(height: 48)
        .padding(.horizontal, 12)
        .overlay {
            if let error = self.errorInfo {
                RoundedRectangle(cornerRadius: 4)
                    .stroke(
                        error.onError ? Color.customRedColor : Color.customBlackColor,
                        lineWidth: self.inputFocused ? 2 : 1
                    )
            } else if let success = self.successInfo {
                RoundedRectangle(cornerRadius: 4)
                    .stroke(
                        success.onSuccess ? Color.customGreenColor : Color.customBlackColor,
                        lineWidth: self.inputFocused ? 2 : 1
                    )
            } else {
                RoundedRectangle(cornerRadius: 4)
                    .stroke(
                        Color.customBlackColor,
                        lineWidth: self.inputFocused ? 2 : 1
                    )
            }
        }
    }
    
    private var statusMessageView: some View {
        HStack {
            if let success = self.successInfo {
                Text(success.successMessage)
                    .font(
                        Font.getCustomFontStyle(
                            customFont: .roboto,
                            fontWeight: .regular,
                            size: 12
                        )
                    )
                    .foregroundStyle(Color.customGreenColor)
            }
            
            if let error = self.errorInfo {
                Text(error.errorMessage)
                    .font(
                        Font.getCustomFontStyle(
                            customFont: .roboto,
                            fontWeight: .regular,
                            size: 12
                        )
                    )
                    .foregroundStyle(Color.customRedColor)
            }
        }
        .frame(height: 14)
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            self.inputLabelView
            self.inputFieldView
            self.statusMessageView
        }
        .fixedSize(horizontal: false, vertical: true)
    }
}
