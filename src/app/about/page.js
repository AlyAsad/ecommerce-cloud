import { Container, Box, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" align="center">
          This is a project developed for the CENG495 Cloud Computing course at Middle East Technical University, developed by Aly Asad Gilani.
        </Typography>
      </Box>
    </Container>
  );
}
