import {
  Box,
  BoxProps,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import {
  useTranslate,
  useRouterType,
  useLink,
  useRouterContext,
  useRegister,
  RegisterPageProps,
  RegisterFormTypes,
  BaseRecord,
  HttpError,
  useActiveAuthProvider,
} from "@refinedev/core";
import { ThemedTitle } from "@refinedev/chakra-ui";
import { FormPropsType } from "../index";
import { layoutProps, cardProps } from "./styles";

type RegisterProps = RegisterPageProps<
  BoxProps,
  BoxProps,
  FormPropsType<RegisterFormTypes>
>;

export const RegisterPage: React.FC<RegisterProps> = ({
  providers,
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};

  const routerType = useRouterType();
  const NewLink = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const translate = useTranslate();
  const authProvider = useActiveAuthProvider();
  const { mutate } = useRegister({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, RegisterFormTypes>({
    ...useFormProps,
  });

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <VStack>
            {providers.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                fontSize="sm"
                width="full"
                leftIcon={<>{provider?.icon}</>}
                onClick={() =>
                  mutate({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label ?? <label>{provider.label}</label>}
              </Button>
            ))}
          </VStack>
          <Divider my="6" />
        </>
      );
    }
    return null;
  };

  const importantTextColor = useColorModeValue("brand.500", "brand.200");

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitle collapsed={false} />}
      </div>
    );

  const allContentProps = { ...cardProps, ...contentProps };
  const content = (
    <Box
      bg="chakra-body-bg"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      backgroundColor={useColorModeValue("white", "gray.800")}
      {...allContentProps}
    >
      <Heading
        mb="8"
        textAlign="center"
        fontSize="2xl"
        color={importantTextColor}
      >
        {translate("pages.register.title", "Sign up for your account")}
      </Heading>
      {renderProviders()}
      <form
        onSubmit={handleSubmit((data) => {
          if (onSubmit) {
            return onSubmit(data);
          }

          return mutate(data);
        })}
      >
        <FormControl mt="6" isInvalid={!!errors?.email}>
          <FormLabel htmlFor="email">
            {translate("pages.register.fields.email", "Email")}
          </FormLabel>
          <Input
            id="email"
            type="text"
            placeholder="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: translate(
                  "pages.register.errors.validEmail",
                  "Invalid email address"
                ),
              },
            })}
          />
          <FormErrorMessage>{`${errors.email?.message}`}</FormErrorMessage>
        </FormControl>

        <FormControl mt="6" isInvalid={!!errors?.password}>
          <FormLabel htmlFor="password">
            {translate("pages.register.fields.password", "Password")}
          </FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
            })}
          />
          <FormErrorMessage>{`${errors.password?.message}`}</FormErrorMessage>
        </FormControl>

        <Button mt="6" type="submit" width="full" colorScheme="brand">
          {translate("pages.register.buttons.submit", "Sign up")}
        </Button>

        {loginLink ?? (
          <Box display="flex" justifyContent="flex-end" mt="6" fontSize="12px">
            <span>
              {translate("pages.login.buttons.haveAccount", "Have an account?")}
            </span>
            <ChakraLink
              color={importantTextColor}
              ml="1"
              fontWeight="bold"
              as={Link}
              to="/login"
            >
              {translate("pages.login.signin", "Sign in")}
            </ChakraLink>
          </Box>
        )}
      </form>
    </Box>
  );

  const allWrapperProps = { ...layoutProps, ...wrapperProps };
  return (
    <Box {...allWrapperProps}>
      {renderContent ? (
        renderContent(content, PageTitle)
      ) : (
        <>
          {PageTitle}
          {content}
        </>
      )}
    </Box>
  );
};
