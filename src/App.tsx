import { ChakraProvider } from "@chakra-ui/react";
import {
    ErrorComponent,
    ThemedLayoutV2,
    notificationProvider,
    RefineThemes,
    AuthPage
} from "@refinedev/chakra-ui";
import { Refine , Authenticated} from "@refinedev/core";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { BlogPostList } from "pages/blog-posts/list";
import { BlogPostEdit } from "pages/blog-posts/edit";
import { BlogPostShow } from "pages/blog-posts/show";
import { BlogPostCreate } from "pages/blog-posts/create";
import { ChakraUIInferencer } from "@refinedev/inferencer/chakra-ui";


import { AuthBindings } from "@refinedev/core";
import axios from "axios";
import authProvider from "./authProvider";

const App = () => {
    return (
        <ChakraProvider theme={RefineThemes.Blue}>
            <BrowserRouter>
                <Refine
                    authProvider={authProvider}
                    notificationProvider={notificationProvider()}
                    routerProvider={routerBindings}
                    dataProvider={dataProvider(
                        "https://api.fake-rest.refine.dev",
                    )}
                    resources={[
                        {
                            name: "blog_posts",
                            meta: {
                              canDelete: true,
                            },
                            list: "/blog-posts",
                            show: "/blog-posts/show/:id",
                            create: "/blog-posts/create",
                            edit: "/blog-posts/edit/:id",
                        },
                    ]}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                    }}
                >
                    <Routes>
                        {/* <Route
                            element={
                                <Authenticated fallback={<Outlet />}>
                                    <ThemedLayoutV2>
                                        <Outlet />
                                    </ThemedLayoutV2>
                                </Authenticated>
                            }
                        >
                            <Route
                                path="/login"
                                element={<AuthPage type="login" />}
                            />
                        </Route> */}
                        <Route
                            element={
                                <Authenticated
                                    fallback={
                                        <CatchAllNavigate to="/login" />
                                    }
                                >
                                    <ThemedLayoutV2>
                                        <Outlet />
                                    </ThemedLayoutV2>
                                </Authenticated>
                            }
                        >
                            <Route index element={<NavigateToResource resource="blog_posts" />} />
                            <Route path="blog-posts">
                                <Route index element={<BlogPostList />} />
                                {/* <Route index element={<ChakraUIInferencer />} /> */}
                                <Route
                                    path="show/:id"
                                    element={<BlogPostShow />}
                                />
                                <Route
                                    path="edit/:id"
                                    element={<BlogPostEdit />}
                                />
                                <Route
                                    path="create"
                                    element={<BlogPostCreate />}
                                />
                            </Route>
                            
                            <Route path="*" element={<ErrorComponent />} />
                        </Route>
                        <Route>
                            <Route
                                path="/login"
                                element={<AuthPage type="login" />}
                            />
                            <Route
                                path="/register"
                                element={<AuthPage type="register" />}
                            />
                            <Route
                                path="/forgot-password"
                                element={<AuthPage type="forgotPassword" />}
                            />
                            <Route
                                path="/update-password"
                                element={<AuthPage type="updatePassword" />}
                            />
                        </Route>
                    </Routes>
                    <UnsavedChangesNotifier />
                </Refine>
            </BrowserRouter>
        </ChakraProvider>
    );
};

export default App;