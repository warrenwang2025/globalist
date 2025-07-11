"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Country codes data with unique identifiers
const countryCodes = [
  { id: "us", code: "+1", country: "United States", flag: "🇺🇸" },
  { id: "ca", code: "+1", country: "Canada", flag: "🇨🇦" },
  { id: "gb", code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { id: "fr", code: "+33", country: "France", flag: "🇫🇷" },
  { id: "de", code: "+49", country: "Germany", flag: "🇩🇪" },
  { id: "it", code: "+39", country: "Italy", flag: "🇮🇹" },
  { id: "es", code: "+34", country: "Spain", flag: "🇪🇸" },
  { id: "nl", code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { id: "se", code: "+46", country: "Sweden", flag: "🇸🇪" },
  { id: "no", code: "+47", country: "Norway", flag: "🇳🇴" },
  { id: "dk", code: "+45", country: "Denmark", flag: "🇩🇰" },
  { id: "ch", code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { id: "at", code: "+43", country: "Austria", flag: "🇦🇹" },
  { id: "be", code: "+32", country: "Belgium", flag: "🇧🇪" },
  { id: "pt", code: "+351", country: "Portugal", flag: "🇵🇹" },
  { id: "gr", code: "+30", country: "Greece", flag: "🇬🇷" },
  { id: "pl", code: "+48", country: "Poland", flag: "🇵🇱" },
  { id: "cz", code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { id: "hu", code: "+36", country: "Hungary", flag: "🇭🇺" },
  { id: "ro", code: "+40", country: "Romania", flag: "🇷🇴" },
  { id: "bg", code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { id: "hr", code: "+385", country: "Croatia", flag: "🇭🇷" },
  { id: "si", code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { id: "sk", code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { id: "lt", code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { id: "lv", code: "+371", country: "Latvia", flag: "🇱🇻" },
  { id: "ee", code: "+372", country: "Estonia", flag: "🇪🇪" },
  { id: "fi", code: "+358", country: "Finland", flag: "🇫🇮" },
  { id: "ie", code: "+353", country: "Ireland", flag: "🇮🇪" },
  { id: "is", code: "+354", country: "Iceland", flag: "🇮🇸" },
  { id: "ru", code: "+7", country: "Russia", flag: "🇷🇺" },
  { id: "ua", code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { id: "by", code: "+375", country: "Belarus", flag: "🇧🇾" },
  { id: "tr", code: "+90", country: "Turkey", flag: "🇹🇷" },
  { id: "il", code: "+972", country: "Israel", flag: "🇮🇱" },
  { id: "ae", code: "+971", country: "UAE", flag: "🇦🇪" },
  { id: "sa", code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { id: "kw", code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { id: "qa", code: "+974", country: "Qatar", flag: "🇶🇦" },
  { id: "bh", code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { id: "om", code: "+968", country: "Oman", flag: "🇴🇲" },
  { id: "jo", code: "+962", country: "Jordan", flag: "🇯🇴" },
  { id: "lb", code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { id: "eg", code: "+20", country: "Egypt", flag: "🇪🇬" },
  { id: "za", code: "+27", country: "South Africa", flag: "🇿🇦" },
  { id: "ng", code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { id: "ke", code: "+254", country: "Kenya", flag: "🇰🇪" },
  { id: "gh", code: "+233", country: "Ghana", flag: "🇬🇭" },
  { id: "ma", code: "+212", country: "Morocco", flag: "🇲🇦" },
  { id: "dz", code: "+213", country: "Algeria", flag: "🇩🇿" },
  { id: "tn", code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { id: "in", code: "+91", country: "India", flag: "🇮🇳" },
  { id: "cn", code: "+86", country: "China", flag: "🇨🇳" },
  { id: "jp", code: "+81", country: "Japan", flag: "🇯🇵" },
  { id: "kr", code: "+82", country: "South Korea", flag: "🇰🇷" },
  { id: "sg", code: "+65", country: "Singapore", flag: "🇸🇬" },
  { id: "my", code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { id: "th", code: "+66", country: "Thailand", flag: "🇹🇭" },
  { id: "vn", code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { id: "ph", code: "+63", country: "Philippines", flag: "🇵🇭" },
  { id: "id", code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { id: "au", code: "+61", country: "Australia", flag: "🇦🇺" },
  { id: "nz", code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { id: "br", code: "+55", country: "Brazil", flag: "🇧🇷" },
  { id: "ar", code: "+54", country: "Argentina", flag: "🇦🇷" },
  { id: "cl", code: "+56", country: "Chile", flag: "🇨🇱" },
  { id: "co", code: "+57", country: "Colombia", flag: "🇨🇴" },
  { id: "pe", code: "+51", country: "Peru", flag: "🇵🇪" },
  { id: "ve", code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { id: "mx", code: "+52", country: "Mexico", flag: "🇲🇽" },
];

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    selectedCountry: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const passwordRequirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "One special character" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Country selection validation
    if (!formData.selectedCountry) {
      newErrors.selectedCountry = "Please select a country";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[\d\s\-\(\)]{7,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const failedRequirements = passwordRequirements.filter(
        (req) => !req.regex.test(formData.password)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log("Submitting registration data:", formData);
      const response = await axios.post("/api/auth/register", formData);

      console.log("Registration successful:", response.data);
      router.push("/signin?registered=true");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors({
          general: error.response.data.message || "An error occurred.",
        });
      } else {
        console.error("Registration error:", error);
        setErrors({
          general: "Could not connect to the server. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      setSocialLoading(provider);
      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: `${provider} sign up failed. Please try again.` });
      }
    } catch (error) {
      setErrors({ general: `${provider} sign up error. Please try again.` });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter((req) =>
      req.regex.test(formData.password)
    ).length;
    return metRequirements;
  };

  const isFormValid = () => {
    return (
      formData.agreeToTerms &&
      formData.fullName.trim() &&
      formData.email &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.selectedCountry &&
      formData.phoneNumber &&
      formData.password &&
      formData.confirmPassword &&
      passwordRequirements.every((req) => req.regex.test(formData.password)) &&
      formData.password === formData.confirmPassword
    );
  };

  // Get selected country data for display
  const selectedCountryData = countryCodes.find(
    (country) => country.id === formData.selectedCountry
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Join Globalist Media Suite today
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading === "google"}
            >
              {socialLoading === "google" ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Sign up with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-3 text-sm font-medium hover:bg-blue-50 transition-colors"
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading === "facebook"}
            >
              {socialLoading === "facebook" ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              Sign up with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="flex gap-2">
              <Select
                value={formData.selectedCountry}
                onValueChange={(value) =>
                  handleInputChange("selectedCountry", value)
                }
              >
                <SelectTrigger
                  className={`w-[140px] sm:w-[180px] ${
                    errors.selectedCountry ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Country">
                    {selectedCountryData && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span>{selectedCountryData.flag}</span>
                        <span className="text-xs sm:text-sm">
                          {selectedCountryData.code}
                        </span>
                        <span className="hidden sm:inline text-xs text-muted-foreground truncate">
                          {selectedCountryData.country}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span className="font-mono">{country.code}</span>
                        <span className="text-sm">{country.country}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`flex-1 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.selectedCountry && (
              <p className="text-sm text-red-500">{errors.selectedCountry}</p>
            )}
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-1">
                  {passwordRequirements.map((req, index) => {
                    const isMet = req.regex.test(formData.password);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {isMet ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span
                          className={`text-xs ${
                            isMet ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Password Strength</span>
                    <span>{getPasswordStrength()}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        getPasswordStrength() <= 2
                          ? "bg-red-500"
                          : getPasswordStrength() <= 4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={
                  errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked as boolean)
                }
                className={errors.agreeToTerms ? "border-red-500" : ""}
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div
            className={`w-full ${!isFormValid() ? "cursor-not-allowed" : ""}`}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
