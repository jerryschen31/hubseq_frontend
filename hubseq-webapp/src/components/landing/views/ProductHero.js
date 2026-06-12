import * as React from 'react';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import { signIn } from "utils/mock-auth";

const backgroundImage =
    "/static/hubseq-blue-splash-background.png"
//  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400';

export default function ProductHero() {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#E0E0E0', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography sx={{ mt: 10 }} color="#E0E0E0" align="center" variant="h2">
        <p>One secure platform</p> for your lab sequencing data
      </Typography>
      <Typography
        color="#E0E0E0"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Easily go from sequencing data to results.
      </Typography>
      <Button
        variant="contained"
        size="large"
        component="a"
        sx={{ minWidth: 200, backgroundColor: "#36454F", borderRadius: 8, border: 1, borderColor: "#E0E0E0" }}
        onClick={() => signIn("cognito", { callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_CALLBACK_URL })}
      >
        Get Started
      </Button>
    </ProductHeroLayout>
  );
}
