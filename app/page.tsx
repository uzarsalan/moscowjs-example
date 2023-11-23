"use client";

import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
  TextFieldInput,
  TextFieldRoot,
  TextFieldSlot,
} from "@radix-ui/themes";
import useSWR, { useSWRConfig } from "swr";
import { addUser, getUsers, removeUser } from "./actions";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [error, setError] = useState("");

  const { mutate } = useSWRConfig();

  const { data: users, isLoading } = useSWR("users", getUsers);

  async function onClickAddUser() {
    setDisableButton(true);
    setError("");
    try {
      await addUser({ name, email });
      await mutate("users");
    } catch (error) {
      console.log(error);
      setError((error as { message: string }).message);
    } finally {
      setDisableButton(false);
    }
  }

  async function onClickRemoveUser(id: number) {
    try {
      await removeUser(id);
      await mutate("users");
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  return (
    <Container>
      <Section>
        <Heading>Users</Heading>
      </Section>
      <Section>
        <Grid gap="5" columns="3">
          <Flex
            direction="column"
            align="center"
            width="100%"
            className="col-span-2"
          >
            {isLoading ? (
              <Text>Loading...</Text>
            ) : !!users && users.length > 0 ? (
              <TableRoot className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableColumnHeaderCell>ID</TableColumnHeaderCell>
                    <TableColumnHeaderCell>Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell>Email</TableColumnHeaderCell>
                    <TableColumnHeaderCell></TableColumnHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} align="center">
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>

                      <TableCell width="100px">
                        <Button onClick={() => onClickRemoveUser(user.id)}>
                          Удалить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableRoot>
            ) : (
              <Text>No users</Text>
            )}
          </Flex>
          <Flex direction="column" gap="2">
            <TextFieldRoot>
              <TextFieldSlot>Name</TextFieldSlot>
              <TextFieldInput
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </TextFieldRoot>
            <TextFieldRoot>
              <TextFieldSlot>Email</TextFieldSlot>
              <TextFieldInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </TextFieldRoot>
            {!!error && <Text color="red">{error}</Text>}
            <Button onClick={onClickAddUser} disabled={disableButton}>
              Add user
            </Button>
          </Flex>
        </Grid>
      </Section>
    </Container>
  );
}
