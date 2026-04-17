import React, { useContext } from 'react';
import { LiaShippingFastSolid, LiaGiftSolid } from 'react-icons/lia';
import { PiKeyReturn } from 'react-icons/pi';
import { BsWallet2 } from 'react-icons/bs';
import { BiSupport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdChatBubbleOutline } from 'react-icons/md';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF, FaPinterestP, FaInstagram } from 'react-icons/fa';
import { AiOutlineYoutube } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import Drawer from '@mui/material/Drawer';
import CartPanel from '../CartPanel';
import { MyContext } from '../../App';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from '../ProductZoom/';
import ProductDetailsComponent from '../ProductDetails';
import AddAress from '../../Page/MyAccount/addAress';

const Footer = () => {
  const context = useContext(MyContext);

  return (
    <>
      <footer className="mt-6 py-5">
        <div className="container">
          <div className="section-shell overflow-hidden px-5 py-6 md:px-8 md:py-7">
            <div className="grid gap-3 border-b border-[rgba(123,86,61,0.12)] pb-6 md:grid-cols-2 xl:grid-cols-5">
              <div className="soft-card group flex flex-col items-center justify-center p-4 text-center">
                <LiaShippingFastSolid className="text-[34px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#ff5252]" />
                <h3 className="mt-2.5 text-[15px] font-[600]">Free Shipping</h3>
                <p className="text-[12px] font-[500]">For all Orders Over $100</p>
              </div>

              <div className="soft-card group flex flex-col items-center justify-center p-4 text-center">
                <PiKeyReturn className="text-[34px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#ff5252]" />
                <h3 className="mt-2.5 text-[15px] font-[600]">30 Days Returns</h3>
                <p className="text-[12px] font-[500]">For an Exchange Products</p>
              </div>

              <div className="soft-card group flex flex-col items-center justify-center p-4 text-center">
                <BsWallet2 className="text-[34px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#ff5252]" />
                <h3 className="mt-2.5 text-[15px] font-[600]">Securde Payment</h3>
                <p className="text-[12px] font-[500]">Payment Cards Accepted</p>
              </div>

              <div className="soft-card group flex flex-col items-center justify-center p-4 text-center">
                <LiaGiftSolid className="text-[34px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#ff5252]" />
                <h3 className="mt-2.5 text-[15px] font-[600]">Special Gifts</h3>
                <p className="text-[12px] font-[500]">Our First Product Order</p>
              </div>

              <div className="soft-card group flex flex-col items-center justify-center p-4 text-center">
                <BiSupport className="text-[34px] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#ff5252]" />
                <h3 className="mt-2.5 text-[15px] font-[600]">Shupport 24/7</h3>
                <p className="text-[12px] font-[500]">Contact us Anytime</p>
              </div>
            </div>

            <div className="footer flex flex-col gap-6 py-6 xl:flex-row">
              <div className="part1 xl:w-[28%] xl:border-r xl:border-[rgba(123,86,61,0.12)] xl:pr-6">
                <span className="eyebrow mb-4">Contact</span>
                <h2 className="section-heading mb-3 text-[17px]">Contact us</h2>
                <p className="pb-4 text-[13px] font-[400]">
                  ECommerce-Shoping - Mega Super Store <br /> 507 -Union Trade Centre Việt Nam
                </p>
                <Link className="link" to={'mailto:someone@example.com'}>
                  quocvinhtran.0212@gmail.com
                </Link>
                <span className="text-primary mt-3 mb-4 block w-full text-[22px] font-[700]">
                  (+84) 9465-65-316
                </span>

                <div className="soft-card flex items-center gap-3 p-3.5">
                  <MdChatBubbleOutline className="text-primary text-[34px]" />
                  <span className="text-[16px] font-[700]">
                    Online Chat <br /> Get Expert Help
                  </span>
                </div>
              </div>

              <div className="part2 flex xl:w-[37%] xl:pl-3">
                <div className="part2_col1 w-[50%]">
                  <h2 className="mb-3 text-[17px] font-[600]">Products</h2>
                  <ul className="list">
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Prices drop</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">New Products</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Bet Sales</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Contact Us</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Sitemap</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Stores</Link>
                    </li>
                  </ul>
                </div>

                <div className="part2_col2 w-[50%]">
                  <h2 className="mb-3 text-[17px] font-[600]">Our Company</h2>
                  <ul className="list">
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Delivery</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Legal Notice</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">Terms And Conditions Of Use</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">About Us</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/'} className="link">SecurePayment</Link>
                    </li>
                    <li className="mb-2 w-full list-none text-[14px]">
                      <Link to={'/login'} className="link">Login</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="part3 flex flex-col xl:w-[35%] xl:pl-6 xl:pr-3">
                <h2 className="mb-3 text-[17px] font-[600]">Subscribe To Newsletter</h2>
                <p className="text-[13px]">
                  Subscribe to our latest newsletter to get news about special discounts.
                </p>
                <form className="soft-card mt-4 p-4">
                  <input
                    type="text"
                    className="mb-4 h-[44px] w-full rounded-full border border-[rgba(255,82,82,0.14)] bg-white px-4 outline-none focus:border-[rgba(255,82,82,0.5)]"
                    placeholder="Your Email Address"
                  />
                  <Button className="bg-org">SUBSCRIBE</Button>

                  <FormControlLabel
                    control={<Checkbox />}
                    label="I agree to the terms and conditions and the privacy policy"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bottomStrip border-t border-[rgba(123,86,61,0.1)] py-3">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex items-center gap-2">
            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="group flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.12)] bg-white/80 transition-all hover:bg-[#ff5252]"
              >
                <FaFacebookF className="text-[14px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="group flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.12)] bg-white/80 transition-all hover:bg-[#ff5252]"
              >
                <AiOutlineYoutube className="text-[14px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="group flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.12)] bg-white/80 transition-all hover:bg-[#ff5252]"
              >
                <FaPinterestP className="text-[14px] group-hover:text-white" />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to={'/'}
                target="_blank"
                className="group flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,82,82,0.12)] bg-white/80 transition-all hover:bg-[#ff5252]"
              >
                <FaInstagram className="text-[14px] group-hover:text-white" />
              </Link>
            </li>
          </ul>

          <p className="m-0 text-center text-[13px]">© 2024 - Ecommerce Template</p>

          <div className="flex items-center gap-1 rounded-full border border-[rgba(255,82,82,0.12)] bg-white/80 px-3 py-1.5">
            <img src="/cart1.png" alt="cart" />
            <img src="/cart2.png" alt="cart" />
            <img src="/card3.png" alt="cart" />
            <img src="/card4.png" alt="cart" />
            <img src="/card5.png" alt="cart" />
          </div>
        </div>
      </div>

      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor={'right'}
        className="cartPanel"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-3 overflow-hidden border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
            <h4>Shopping Cart ({context?.cartData?.length || 0})</h4>
            <IoCloseSharp
              className="cursor-pointer text-[20px]"
              onClick={context.toggleCartPanel(false)}
            />
          </div>
          {context?.cartData?.length ? (
            <CartPanel data={context?.cartData} onClose={context.toggleCartPanel(false)} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
              <img src="/cartfoot.png" className="w-[250px]" alt="Empty Cart" />
              <h4>Your Cart is currently empty</h4>
              <Button className="bg-org btn-sm" onClick={context.toggleCartPanel(false)}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      <Drawer
        open={context?.openAddressPanel}
        onClose={context?.toggleAddressPanel(false)}
        anchor={'right'}
        className="addressPanel"
      >
        <div className="flex items-center justify-between gap-3 overflow-hidden border-b border-[rgba(0,0,0,0.1)] px-4 py-3">
          <h4>{context?.addressMode === 'add' ? 'Add' : 'Edit'} Delivery Address</h4>
          <IoCloseSharp
            className="cursor-pointer text-[20px]"
            onClick={context?.toggleAddressPanel(false)}
          />
        </div>

        <AddAress />
      </Drawer>

      <Dialog
        open={context?.openProductDetailsModal.open}
        fullWidth={context?.fullWidth}
        maxWidth={context?.maxWidth}
        onClose={context?.handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="productDetailsModalContainer relative flex w-full items-center">
            <Button className="!absolute right-[15px] top-[15px] !h-[40px] !min-w-[40px] !w-[40px] !rounded-full !bg-[#f1f1f1] !text-[#000]">
              <IoCloseSharp
                className="text-[20px]"
                onClick={context?.handleCloseProductDetailsModal}
              />
            </Button>
            {context?.openProductDetailsModal?.item?.length !== 0 && (
              <>
                <div className="col1 w-[40%] px-3 py-8">
                  <ProductZoom images={context?.openProductDetailsModal?.item?.images} />
                </div>
                <div className="productContainer col2 w-[60%] py-8 px-8 pr-16">
                  <ProductDetailsComponent item={context?.openProductDetailsModal?.item} />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
