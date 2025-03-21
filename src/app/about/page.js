import { Container, Box, Typography, Link } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          This is a project developed for the CENG495 Cloud Computing course at Middle East Technical University, developed by Aly Asad Gilani.
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 3 }}>
          Please feel free to contact me at these emails if you have any questions or feedback:
        </Typography>
        <Typography variant="body1" align="center">
          <Link href="mailto:alyasad.gilani@gmail.com">alyasad.gilani@gmail.com</Link>
          <br />
          <Link href="mailto:aly.gilani@metu.edu.tr">aly.gilani@metu.edu.tr</Link>
        </Typography>
      </Box>
    </Container>
  );
}
